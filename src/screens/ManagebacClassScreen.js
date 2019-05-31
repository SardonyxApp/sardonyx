import React from 'react';

import {
  ScrollView,
  RefreshControl,
  Alert,
  InteractionManager,
  Dimensions
} from 'react-native';

import { BASE_URL } from '../../env';

import UpcomingCarousel from '../components/UpcomingCarousel';
import OverviewHeading from '../components/OverviewHeading';
import MessageListView from '../components/MessageListView';
import { Storage } from '../helpers';

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
      classMessagesTotalPages: 1
    };
    this._onRefresh = this._onRefresh.bind(this);
    this._fetchNextMessages = this._fetchNextMessages.bind(this);
    this._fetchClassOverviewData = this._fetchClassOverviewData.bind(this);
    this._fetchClassMessagesData = this._fetchClassMessagesData.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    InteractionManager.runAfterInteractions(this._onRefresh);
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
          classMessagesTotalPages: parsedManagebacResponse.numberOfPages
        });
        return;
      } else {
        Alert.alert('Error', 'Messages could not be loaded.', []);
        return;
      }
    });
  }

  render() {
    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
        }
        onScroll={event => {
          let windowHeight = Dimensions.get('window').height,
            height = event.nativeEvent.contentSize.height,
            offset = event.nativeEvent.contentOffset.y;
          if (windowHeight + offset >= height) {
            // Thank you GitHub
            // https://github.com/facebook/react-native/issues/2299
            this._fetchNextMessages();
          }
        }}
      >
        <UpcomingCarousel
          upcomingEvents={this.state.classUpcomingEventsData}
          completedEvents={this.state.classCompletedEventsData}
          allGroupsAndClasses={[this.props.navigation.state.params]}
          navigation={this.props.navigation}
        />
        {/** OverviewHeading has a default marginBottom of -16px */}
        <OverviewHeading style={{ marginBottom: 0 }}>Messages</OverviewHeading>
        <MessageListView
          messages={[].concat(...this.state.classMessagesData)}
          onScrollEnd={this._fetchNextMessages}
          loading={this.state.fetchingMessages}
          navigation={this.props.navigation}
        />
      </ScrollView>
    );
  }
}
