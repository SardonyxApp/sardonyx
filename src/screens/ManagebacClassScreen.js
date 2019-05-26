import React from 'react';

import {
  ScrollView,
  RefreshControl,
  Alert,
  View,
  Text,
  FlatList,
  Image,
  StyleSheet
} from 'react-native';

import { DangerZone } from 'expo';
const { Lottie } = DangerZone;
import HTMLView from 'react-native-htmlview';
import { BASE_URL } from '../../env';

import UpcomingCarousel from '../components/UpcomingCarousel';
import OverviewHeading from '../components/OverviewHeading';
import { Storage } from '../helpers';
import { fonts } from '../styles';

/**
 * TODO: This screen is god damn resource intensive
 * TODO: Somehow split into smaller components
 */
export default class ManagebacClassScreen extends React.Component {
  isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      // refreshing state, this will control RefreshControl, fired when scrolled up
      refreshing: true,
      // message state, this controls nothing, fired when _fetchMessage
      fetchingMessages: true,
      classUpcomingEventsData: [],
      classCompletedEventsData: [],
      classMessagesData: [],
      classMessagesDataConcatted: [],
      classMessagesTotalPages: 1
    };
    this._onRefresh = this._onRefresh.bind(this);
    this._fetchNextMessages = this._fetchNextMessages.bind(this);
    this._fetchClassOverviewData = this._fetchClassOverviewData.bind(this);
    this._fetchClassMessagesData = this._fetchClassMessagesData.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    this._onRefresh();
    // For some reason this.animation.play() doesn't work when immediately called
    // Weird, because it works in LoginCheckScreen
    setTimeout(() => {
      this.animation.play();
    }, 50);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: `${navigation.state.params.title}`
    };
  };

  /**
   * Called on load, and on pull-to-refresh. Asynchronously sets the state using newest class data.
   */
  _onRefresh() {
    this.setState(
      {
        refreshing: true
      },
      () => {
        Storage.retrieveCredentials()
          .then(credentials => {
            this._fetchClassOverviewData(credentials);
            this._fetchClassMessagesData(credentials);
          })
          .catch(err => {
            console.warn(err);
          });
      }
    );
  }

  /**
   * After performing several checks, load the next page of messages.
   */
  _fetchNextMessages() {
    if (!this._isMounted) return;
    // Don't call fetch if it's already fetching something
    if (this.state.fetchingMessages) return;
    // Don't call fetch if it's the last page already.
    if (
      this.state.classMessagesTotalPages === this.state.classMessagesData.length
    )
      return;
    // Lock the state and fetch messages
    this.setState(
      {
        fetchingMessages: true
      },
      () => {
        Storage.retrieveCredentials()
          .then(credentials => {
            this._fetchClassMessagesData(
              credentials,
              this.state.classMessagesData.length + 1
            );
          })
          .catch(err => {
            console.warn(err);
          });
      }
    );
  }

  /**
   * Called on load, and on pull-to-refresh. Asynchronously sets the state using newest class data.
   * @param {String} credentials
   */
  _fetchClassOverviewData(credentials) {
    let url = this.props.navigation.getParam('link', '/404');
    url = url.replace('/overview', '/assignments');
    fetch(BASE_URL + url, {
      method: 'GET',
      headers: {
        'Login-Token': credentials
      },
      mode: 'no-cors'
    }).then(response => {
      if (!this._isMounted) return;
      if (response.status === 200) {
        const parsedManagebacResponse = JSON.parse(
          response.headers.map['managebac-data']
        );
        this.setState({
          refreshing: false,
          classUpcomingEventsData: parsedManagebacResponse.upcoming,
          classCompletedEventsData: parsedManagebacResponse.completed
        });
        return;
      } else if (response.status === 404) {
        Alert.alert('Not Found', 'Class could not be found.', []);
        this.props.navigation.goBack();
        return;
      }
    });
  }

  /**
   * Called on load, and on scroll to bottom. Asynchronously sets the state using newest messages.
   * @param {String} credentials
   * @param {Integer} page
   */
  _fetchClassMessagesData(credentials, page = 1) {
    let url = this.props.navigation.getParam('link', '/404');
    url = url.replace('/overview', '/messages');
    fetch(BASE_URL + url + '?pageParam=' + page.toString(), {
      method: 'GET',
      headers: {
        'Login-Token': credentials
      },
      mode: 'no-cors'
    }).then(response => {
      if (!this._isMounted) return;
      if (response.status === 200) {
        const parsedManagebacResponse = JSON.parse(
          response.headers.map['managebac-data']
        );
        // Place messages from a paeg into its own array inside messages[]
        // This will be concat-ed when sending to MessageListView, don't worry
        // Keeping it like an array makes it possible to count the currently loaded page count.
        let messages = this.state.classMessagesData;
        messages[page - 1] = parsedManagebacResponse.messages;
        this.setState({
          fetchingMessages: false,
          classMessagesData: messages,
          classMessagesDataConcatted: [].concat(...messages),
          classMessagesTotalPages: parsedManagebacResponse.numberOfPages
        });
        return;
      } else {
        // Za end has been reached
        this.setState({
          fetchingMessages: false
        });
        return;
      }
    });
  }

  /**
   * Render each message in its own row.
   * @param {{ Object, Integer }}
   * @return {React.Component}
   */
  _renderMessage({ item, index }) {
    return (
      <View style={messageListStyles.messageContainer}>
        <View style={messageListStyles.imageContainer}>
          <Image
            source={
              item.avatar
                ? {
                    uri: item.avatar
                  }
                : require('../logos/Icon.png')
            }
            style={messageListStyles.image}
          />
        </View>
        <View style={messageListStyles.text}>
          <Text style={messageListStyles.author}>{item.author}</Text>
          <Text style={messageListStyles.title} numberOfLines={1}>
            {decodeURI(item.title)}
          </Text>
          <HTMLView
            style={messageListStyles.content}
            value={`<html><body>${item.content}</body></html>`}
            stylesheet={htmlStyles}
            textComponentProps={{
              style: htmlStyles.text
            }}
            nodeComponentProps={{
              numberOfLines: 1
            }}
          />
        </View>
      </View>
    );
  }

  render() {
    return (
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
        }
        data={this.state.classMessagesDataConcatted}
        renderItem={this._renderMessage}
        keyExtractor={(item, index) => item.id.toString()}
        onEndReached={this._fetchNextMessages}
        onEndReachedThreshold={0.01}
        ListHeaderComponent={
          <View>
            <UpcomingCarousel
              upcomingEvents={this.state.classUpcomingEventsData}
              completedEvents={this.state.classCompletedEventsData}
              allGroupsAndClasses={[this.props.navigation.state.params]}
              navigation={this.props.navigation}
            />
            {/** OverviewHeading has a default marginBottom of -16px */}
            <OverviewHeading style={{ marginBottom: 0 }}>
              Messages
            </OverviewHeading>
          </View>
        }
        ListFooterComponent={
          <View style={messageListStyles.lottieContainer}>
            <Lottie
              style={messageListStyles.lottie}
              ref={animation => {
                this.animation = animation;
              }}
              loop={true}
              autoPlay={true}
              source={require('../assets/loader.json')}
            />
          </View>
        }
      />
    );
  }
}

const messageListStyles = StyleSheet.create({
  messageContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    flex: 1,
    flexDirection: 'row'
  },
  imageContainer: {
    width: 66,
    height: 66
  },
  image: {
    padding: 8,
    width: 50,
    height: 50
  },
  text: {
    flex: 1
  },
  author: {
    fontSize: 9,
    ...fonts.jost300
  },
  title: {
    fontSize: 15,
    ...fonts.jost400
  },
  lottieContainer: {
    flex: 1,
    alignItems: 'center'
  },
  lottie: {
    width: 30,
    height: 30
  }
});

const htmlStyles = StyleSheet.create({
  text: {
    fontSize: 11
  }
});
