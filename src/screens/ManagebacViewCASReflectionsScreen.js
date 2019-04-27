import React from 'react';

import {
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  View,
  Text,
  FlatList,
  RefreshControl,
  Alert
} from 'react-native';

import HTMLView from 'react-native-htmlview';
import { Icon } from 'react-native-elements';
import moment from 'moment';
import { BASE_URL } from '../../env';

import HeaderIcon from '../components/HeaderIcon';
import PreloadImage from '../components/PreloadImage';
import { Storage } from '../helpers';
import { fonts, colors } from '../styles';

export default class ManagebacViewCASReflectionsScreen extends React.Component {
  isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      refreshing: true,
      reflectionsData: [],
      numberOfLines: []
    };
    this._fetchReflectionsData = this._fetchReflectionsData.bind(this);
    this._onRefresh = this._onRefresh.bind(this);
    this._renderRow = this._renderRow.bind(this);
    this._toggleExpand = this._toggleExpand.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    this._onRefresh();
    this.props.navigation.setParams({
      refreshPage: this._onRefresh
    })
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Reflections and Evidence',
      headerRight: (
        <HeaderIcon
          onPress={() => {
            navigation.navigate('AddCASReflection', {
              onGoBack: () => navigation.state.params.refreshPage(),
              id: navigation.state.params.id
            });
          }}
        >
          <Icon name="add" color={colors.white} />
        </HeaderIcon>
      )
    };
  };

  /**
   * Requests /api/cas/:id for the list of reflections. Sets the state on success.
   * @param {String} credentials 
   */
  _fetchReflectionsData(credentials) {
    fetch(
      `${BASE_URL}/api/cas/${this.props.navigation.state.params.id}/reflections`,
      {
        method: 'GET',
        headers: {
          'Login-Token': credentials
        },
        mode: 'no-cors'
      }
    )
      .then(response => {
        if (!this._isMounted) return;
        if (response.status === 200) {
          this.setState({
            refreshing: false,
            reflectionsData: JSON.parse(response.headers.map['managebac-data'])
              .reflections,
            numberOfLines: Array(
              JSON.parse(response.headers.map['managebac-data']).reflections
                .length
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
          <View style={reflectionListStyles.itemContentWrapper}>
            <TouchableOpacity onPress={() => this._toggleExpand(index)}>
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
          <View style={reflectionListStyles.itemContentWrapper}>
            <View style={reflectionListStyles.itemContent}>
              <Text style={reflectionListStyles.imageCaptionText}>{decodeURI(item.photos[0].title)}</Text>
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
      <FlatList
        refreshing={this.state.refreshing}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
        }
        keyExtractor={(item, index) => index.toString()}
        data={this.state.reflectionsData}
        renderItem={this._renderRow}
        extraData={this.state}
      />
    );
  }
}

const reflectionListStyles = StyleSheet.create({
  itemTextWrapper: {
    marginHorizontal: 16,
    marginTop: 8
  },
  itemDate: {
    fontSize: 14
  },
  labels: {
    marginBottom: 6
  },
  label: {
    backgroundColor: '#ccece7',
    paddingHorizontal: 4,
    marginRight: 4,
    borderRadius: 2
  },
  labelText: {
    color: '#00a085',
    fontSize: 11
  },
  itemContentWrapper: {
    elevation: 2,
    marginHorizontal: 16,
    backgroundColor: colors.white,
    borderRadius: 2,
    marginBottom: 16
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
