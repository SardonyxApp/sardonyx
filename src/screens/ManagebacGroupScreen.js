import React from 'react';

import {
  View,
  ScrollView,
  RefreshControl,
  Alert,
  InteractionManager,
  Dimensions,
  StyleSheet
} from 'react-native';

import { BASE_URL } from '../../env';

import UpcomingCarousel from '../components/UpcomingCarousel';
import OverviewHeading from '../components/OverviewHeading';
import MessageListView from '../components/MessageListView';
import CTAButton from '../components/CTAButton';
import { Storage } from '../helpers';

export default class ManagebacGroupScreen extends React.Component {
  isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      // refreshing state, this will control RefreshControl, fired when scrolled up
      refreshing: true,
      // message state, this controls nothing, fired when _fetchMessage
      fetchingMessages: true,
      groupUpcomingEventsData: [],
      groupCompletedEventsData: [],
      groupMessagesData: [],
      groupMessagesTotalPages: 1
    };
    this._onRefresh = this._onRefresh.bind(this);
    this._fetchNextMessages = this._fetchNextMessages.bind(this);
    this._fetchGroupOverviewData = this._fetchGroupOverviewData.bind(this);
    this._fetchGroupMessagesData = this._fetchGroupMessagesData.bind(this);
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
   * Called on load, and on pull-to-refresh. Asynchronously sets the state using newest group data.
   */
  _onRefresh() {
    this.setState(
      {
        refreshing: true
      },
      async () => {
        const credentials = await Storage.retrieveCredentials();
        this._fetchGroupOverviewData(credentials);
        this._fetchGroupMessagesData(credentials);
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
      this.state.groupMessagesTotalPages === this.state.groupMessagesData.length
    )
      return;
    // Lock the state and fetch messages
    this.setState(
      {
        fetchingMessages: true
      },
      async () => {
        const credentials = await Storage.retrieveCredentials();
        this._fetchGroupMessagesData(
          credentials,
          this.state.groupMessagesData.length + 1
        );
      }
    );
  }

  /**
   * Called on load, and on pull-to-refresh. Asynchronously sets the state using newest group data.
   * @param {String} credentials
   */
  async _fetchGroupOverviewData(credentials) {
    let url = this.props.navigation.getParam('link', '/404');
    const response = await fetch(BASE_URL + url, {
      method: 'GET',
      headers: {
        'Login-Token': credentials
      },
      mode: 'no-cors'
    });
    if (!this._isMounted) return;
    if (response.status === 200) {
      const parsedManagebacResponse = await response.json();
      this.setState({
        refreshing: false,
        groupUpcomingEventsData: parsedManagebacResponse.deadlines
      });
      return;
    } else if (response.status === 404) {
      Alert.alert('Not Found', 'Group could not be found.', []);
      this.props.navigation.goBack();
      return;
    }
  }

  /**
   * Called on load, and on scroll to bottom. Asynchronously sets the state using newest messages.
   * @param {String} credentials
   * @param {Integer} page
   */
  async _fetchGroupMessagesData(credentials, page = 1) {
    let url = this.props.navigation.getParam('link', '/404');
    url = url.replace('/overview', '/messages');
    const response = await fetch(
      BASE_URL + url + '?pageParam=' + page.toString(),
      {
        method: 'GET',
        headers: {
          'Login-Token': credentials
        },
        mode: 'no-cors'
      }
    );
    if (!this._isMounted) return;
    if (response.status === 200) {
      const parsedManagebacResponse = await response.json();
      // Place messages from a page into its own array inside messages[]
      // This will be concat-ed when sending to MessageListView, don't worry
      // Keeping it like an array makes it possible to count the currently loaded page count.
      let messages = this.state.groupMessagesData;
      messages[page - 1] = parsedManagebacResponse.messages;
      this.setState({
        fetchingMessages: false,
        groupMessagesData: messages,
        groupMessagesTotalPages: parsedManagebacResponse.numberOfPages
      });
      return;
    } else {
      Alert.alert('Error', 'Messages could not be loaded.', []);
      return;
    }
  }

  render() {
    return (
      <View style={groupStyles.page}>
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
            if (windowHeight + offset >= height - 500) {
              // Thank you GitHub
              // https://github.com/facebook/react-native/issues/2299
              this._fetchNextMessages();
            }
          }}
        >
          <UpcomingCarousel
            upcomingEvents={this.state.groupUpcomingEventsData}
            completedEvents={this.state.groupCompletedEventsData}
            allGroupsAndClasses={[this.props.navigation.state.params]}
            navigation={this.props.navigation}
          />
          {/** OverviewHeading has a default marginBottom of -16px */}
          <OverviewHeading style={{ marginBottom: 0 }}>
            Messages
          </OverviewHeading>
          <MessageListView
            messages={[].concat(...this.state.groupMessagesData)}
            onScrollEnd={this._fetchNextMessages}
            loading={this.state.fetchingMessages}
            navigation={this.props.navigation}
          />
        </ScrollView>
        <CTAButton
          style={groupStyles.cta}
          onPress={() => {
            this.props.navigation.navigate('MessageEditor', {
              onGoBack: this._onRefresh,
              type: 'class',
              id: this.props.navigation.state.params.id
            });
          }}
        >
          New Message
        </CTAButton>
      </View>
    );
  }
}

const groupStyles = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: 'center'
  },
  cta: {
    position: 'absolute',
    bottom: 16
  }
});
