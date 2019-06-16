import React from 'react';

import {
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  View,
  Text,
  FlatList,
  RefreshControl,
  Alert,
  Vibration,
  InteractionManager,
  Platform
} from 'react-native';

import { Haptic } from 'expo';
import HTMLView from 'react-native-htmlview';
import { Appbar } from 'react-native-paper';
import { Icon } from 'react-native-elements';
import moment from 'moment';
import { BASE_URL } from '../../env';

import HeaderIcon from '../components/HeaderIcon';
import PreloadImage from '../components/PreloadImage';
import { Storage } from '../helpers';
import { fonts, colors } from '../styles';
import ExperienceUneditableWarning from '../components/ExperienceUneditableWarning';

export default class ManagebacViewCASReflectionsScreen extends React.Component {
  isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      refreshing: true,
      reflectionsData: [],
      numberOfLines: [],
      menuVisible: false,
      menuFocusedOn: null
    };
    this._fetchReflectionsData = this._fetchReflectionsData.bind(this);
    this._onRefresh = this._onRefresh.bind(this);
    this._renderRow = this._renderRow.bind(this);
    this._toggleExpand = this._toggleExpand.bind(this);
    this._showMenu = this._showMenu.bind(this);
    this._hideMenu = this._hideMenu.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    this.props.navigation.setParams({
      refreshPage: this._onRefresh
    });
    InteractionManager.runAfterInteractions(this._onRefresh);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Reflections and Evidence',
      headerRight: navigation.state.params.editable ? (
        <HeaderIcon
          onPress={() => {
            navigation.navigate('AddCASReflection', {
              onGoBack: navigation.state.params.refreshPage,
              id: navigation.state.params.id
            });
          }}
        >
          <Icon name="add" color={colors.white} />
        </HeaderIcon>
      ) : null
    };
  };

  /**
   * Requests /api/cas/:id for the list of reflections. Sets the state on success.
   * @param {String} credentials
   */
  _fetchReflectionsData(credentials) {
    fetch(
      `${BASE_URL}/api/cas/${
        this.props.navigation.state.params.id
      }/reflections`,
      {
        method: 'GET',
        headers: {
          'Login-Token': credentials
        },
        mode: 'no-cors'
      }
    )
      .then(r => r.json().then(data => ({ response: r, data: data })))
      .then(({ response, data }) => {
        if (!this._isMounted) return;
        if (response.status === 200) {
          this.setState({
            refreshing: false,
            reflectionsData: data.reflections,
            numberOfLines: Array(
              data.reflections.length
            ).fill(10)
          });
          return;
        } else {
          Alert.alert(
            'Internal Error',
            'Error ' + response.status.toString() + ': Invalid Response.',
            []
          );
          this.props.navigation.goBack();
          return;
        }
      })
      .catch(error => {
        console.warn(error);
        return;
      });
  }

  /**
   * Set the refreshing controller as visible, and call _fetchReflectionsData().
   */
  _onRefresh() {
    this.setState(
      {
        refreshing: true
      },
      () => {
        Storage.retrieveCredentials()
          .then(this._fetchReflectionsData)
          .catch(err => {
            console.warn(err);
          });
      }
    );
  }

  /**
   * Remove non-HTML newlines, and return the decoded HTML.
   * @param {String} content
   */
  _parseContent(content) {
    content = content.replace(/%0A/g, '');
    return decodeURI(content);
  }

  /**
   * Toggles the value of state.numberOfLines[index] between 10 and null.
   * @param {Integer} index
   */
  _toggleExpand(index) {
    const newNumberOfLines = [...this.state.numberOfLines];
    if (newNumberOfLines[index] === 10) {
      newNumberOfLines[index] = null;
    } else {
      newNumberOfLines[index] = 10;
    }
    this.setState({
      numberOfLines: newNumberOfLines
    });
  }

  /**
   * Show the AppBar menu, focused on a reflection through index (NOT id).
   * @param {Integer} index
   */
  _showMenu(index) {
    if (Platform.OS === 'android') {
      Vibration.vibrate(50);
    } else if (Platform.OS === 'ios') {
      Haptic.selection();
    }
    this.setState({
      menuVisible: true,
      menuFocusedOn: this.state.reflectionsData[index].id
    });
  }

  /**
   * Hides AppBar.
   */
  _hideMenu() {
    this.setState({
      menuVisible: false,
      menuFocusedOn: null
    });
  }

  /**
   * Confirms the user if they really want to delete the reflection. Then calls _deleteItem()
   * @param {Integer} id
   */
  _confirmDelete(id) {
    Alert.alert(
      'Delete',
      'Are you sure you want to delete this reflection/evidence?',
      [
        {
          text: 'No, keep it!'
        },
        {
          text: 'Yes, delete',
          onPress: () => this._deleteItem(id)
        }
      ]
    );
  }

  /**
   * Calls _requestDeleteReflection using credentials.
   * @param {Integer} id
   */
  _deleteItem(id) {
    this.setState(
      {
        refreshing: true,
        menuVisible: false,
        menuFocusedOn: null
      },
      () => {
        Storage.retrieveCredentials()
          .then(credentials => this._requestDeleteReflection(credentials, id))
          .catch(err => {
            console.warn(err);
          });
      }
    );
  }

  /**
   * Sends a DELETE request to delete the specific reflection. Calls _onRefresh on success.
   * @param {String} credentials
   * @param {Integer} id
   */
  _requestDeleteReflection(credentials, id) {
    fetch(
      `${BASE_URL}/api/cas/${
        this.props.navigation.state.params.id
      }/reflections/${id.toString()}`,
      {
        method: 'DELETE',
        headers: {
          'Login-Token': credentials
        },
        mode: 'no-cors'
      }
    )
      .then(response => {
        if (!this._isMounted) return;
        this._onRefresh();
      })
      .catch(error => {
        console.warn(error);
        return;
      });
  }

  /**
   * Navigates to EditCASReflection with current value, and refreshes on Back action.
   * @param {Integer} id
   */
  _editItem(id) {
    this.props.navigation.navigate('EditCASReflection', {
      id: this.props.navigation.state.params.id,
      reflectionId: id.toString(),
      currentValueHTML: this._parseContent(
        this.state.reflectionsData.filter(obj => {
          return obj.id === id;
        })[0].content
      ),
      onGoBack: () => {
        this._hideMenu();
        this._onRefresh();
      }
    });
  }

  /**
   * Function to return a FlatList of learning outcome labels to be called for each reflection item.
   * @param {Array} labels
   */
  _renderLabels(labels) {
    return (
      <FlatList
        data={labels}
        horizontal={true}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={reflectionListStyles.label}>
            <Text style={reflectionListStyles.labelText}>{item}</Text>
          </View>
        )}
      />
    );
  }

  /**
   * Renders each reflection/evidence data. Has separate rendering functions for photo and reflection.
   * @param {Object}
   */
  _renderRow({ item, index }) {
    if (item.type === 'reflection') {
      return (
        <View>
          <View style={reflectionListStyles.itemTextWrapper}>
            <Text style={reflectionListStyles.itemDate}>
              {moment(item.date).format('dddd, MMM Do YYYY, H:mm')}
            </Text>
            <View style={reflectionListStyles.labels}>
              {this._renderLabels(item.labels)}
            </View>
          </View>
          <View
            style={[
              reflectionListStyles.itemContentWrapper,
              this.state.menuFocusedOn === item.id
                ? reflectionListStyles.focusedItem
                : {}
            ]}
          >
            <TouchableOpacity
              onPress={() => this._toggleExpand(index)}
              onLongPress={() => this._showMenu(index)}
            >
              <HTMLView
                style={reflectionListStyles.itemContent}
                value={`<html><body>${this._parseContent(
                  item.content
                )}</body></html>`}
                stylesheet={htmlStyles}
                textComponentProps={{
                  style: htmlStyles.text
                }}
                nodeComponentProps={{
                  numberOfLines: this.state.numberOfLines[index]
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    if (item.type === 'photo') {
      return (
        <View>
          <View style={reflectionListStyles.itemTextWrapper}>
            <Text style={reflectionListStyles.itemDate}>
              {moment(item.date).format('dddd, MMM Do YYYY, H:mm')}
            </Text>
            <View style={reflectionListStyles.labels}>
              {this._renderLabels(item.labels)}
            </View>
          </View>
          <View
            style={[
              reflectionListStyles.itemContentWrapper,
              this.state.menuFocusedOn === item.id
                ? reflectionListStyles.focusedItem
                : {}
            ]}
          >
            <View style={reflectionListStyles.itemContent}>
              <Text style={reflectionListStyles.imageCaptionText}>
                {decodeURI(item.photos[0].title)}
              </Text>
              <PreloadImage
                style={reflectionListStyles.image}
                sourceUri={item.photos[0].link}
              />
            </View>
          </View>
        </View>
      );
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView
          refreshing={this.state.refreshing}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
        >
          {/** Refreshing controls are in the parent because it should be above the Warning */}
          <ExperienceUneditableWarning
            status={
              this.props.navigation.state.params.editable ? '' : 'complete'
            }
          />
          <FlatList
            keyExtractor={item => item.id.toString()}
            data={this.state.reflectionsData}
            renderItem={this._renderRow}
            extraData={this.state}
          />
        </ScrollView>
        {this.state.menuVisible ? (
          <Appbar style={reflectionListStyles.appBar}>
            <Appbar.Action
              icon="delete"
              onPress={() => this._confirmDelete(this.state.menuFocusedOn)}
            />
            <Appbar.Action
              icon="edit"
              onPress={() => this._editItem(this.state.menuFocusedOn)}
            />
            <Appbar.Action
              style={reflectionListStyles.appBarClose}
              icon="close"
              onPress={this._hideMenu}
            />
          </Appbar>
        ) : null}
      </View>
    );
  }
}

const reflectionListStyles = StyleSheet.create({
  itemTextWrapper: {
    marginHorizontal: 16,
    marginTop: 8
  },
  itemDate: {
    fontSize: 16,
    ...fonts.jost400
  },
  labels: {
    marginBottom: 6
  },
  label: {
    backgroundColor: '#ccece7',
    paddingHorizontal: 4,
    marginRight: 4,
    borderRadius: 2,
    ...fonts.jost400
  },
  labelText: {
    color: '#00a085',
    fontSize: 12
  },
  itemContentWrapper: {
    elevation: 2,
    marginHorizontal: 16,
    backgroundColor: colors.white,
    borderRadius: 2,
    marginBottom: 16
  },
  focusedItem: {
    backgroundColor: colors.lightBlue2
  },
  itemContent: {
    paddingHorizontal: 16,
    paddingVertical: 8
  },
  imageCaptionText: {
    marginBottom: 8
  },
  image: {
    width: Dimensions.get('window').width - 64,
    flex: 1
  },
  appBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.blue
  },
  appBarClose: {
    position: 'absolute',
    right: 0
  }
});

const htmlStyles = StyleSheet.create({
  p: {
    marginBottom: 4,
    padding: 0
  },
  text: {
    marginBottom: 32
  }
});
