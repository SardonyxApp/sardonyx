import React from 'react';

import {
  View,
  InteractionManager,
  FlatList,
  Text,
  StyleSheet,
  RefreshControl,
  Dimensions
} from 'react-native';

import Lottie from 'lottie-react-native';
import moment from 'moment';
import { BASE_URL } from '../../env';

import { Storage } from '../helpers';
import { fonts, colors } from '../styles';
import { TouchableRipple } from 'react-native-paper';

export default class ManagebacAlertsScreen extends React.Component {
  isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      fetchingMessages: true,
      notificationsData: [],
      notificationsTotalPages: 1,
      notificationsLoadedPages: 0
    };
    this._onRefresh = this._onRefresh.bind(this);
    this._fetchNotificationsData = this._fetchNotificationsData.bind(this);
    this._renderRow = this._renderRow.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    InteractionManager.runAfterInteractions(this._onRefresh);
  }

  componentDidUpdate(_, oldState) {
    if (
      oldState.notificationsData.length !== this.state.notificationsData.length
    )
      this.animation && this.animation.play();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Alerts'
    };
  };

  /**
   * Set the fetching controller as visible, and call _fetchNotificationsData().
   */
  _onRefresh() {
    this.setState(
      {
        fetchingMessages: true
      },
      async () => {
        this._fetchNotificationsData(await Storage.retrieveCredentials());
      }
    );
  }

  /**
   * After performing several checks, load the next page of notifications.
   */
  async _fetchNextNotifications() {
    if (!this._isMounted) return;
    // Don't call fetch if it's already fetching something
    if (this.state.fetchingMessages) return;
    // Don't call fetch if it's the last page already.
    if (
      this.state.notificationsTotalPages === this.state.notificationsLoadedPages
    )
      return;
    const credentials = await Storage.retrieveCredentials();
    this._fetchNotificationsData(
      credentials,
      this.state.notificationsLoadedPages + 1
    );
  }

  /**
   * Requests /api/notification for the list of notifications. Sets the state on success.
   * @param {String} credentials
   */
  async _fetchNotificationsData(credentials, page = 1) {
    const response = await fetch(
      BASE_URL + '/api/notification?pageId=' + page,
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
      let notifications = [...this.state.notificationsData];
      notifications[page - 1] = parsedManagebacResponse.notifications;
      this.setState({
        fetchingMessages: false,
        notificationsData: notifications,
        notificationsTotalPages: parsedManagebacResponse.numberOfPages,
        notificationsLoadedPages: page
      });
      return;
    }
  }

  /**
   * Called on Alert press. Navigate to Alert screen, change the state to mark item as read, and
   * call refresh on the Overview page.
   * @param {Object} pressedItem
   */
  _onPress(pressedItem) {
    this.props.navigation.navigate('Alert', {
      ...pressedItem,
      title: decodeURI(pressedItem.title),
      refreshOverview: this.props.navigation.state.params.refreshPage
    });
    if (pressedItem.unread) {
      const notificationsData = [...this.state.notificationsData];
      pageLoop: for (let page of notificationsData) {
        for (let item of page) {
          if (item.id === pressedItem.id) {
            item.unread = false;
            break pageLoop;
          }
        }
      }
      this.setState({ notificationsData });
    }
    if (this.props.navigation.getParam('refreshPage', null) !== null) {
      this.props.navigation.state.params.refreshPage();
    }
  }

  /**
   * Change all dates within today to Today instead of assuming midnight
   * @param {Moment} date
   */
  _getRelativeDate(date) {
    if (date >= moment().startOf('day')) return 'Today';
    return date.fromNow();
  }

  _renderRow({ item }) {
    return (
      <View style={item.unread ? alertsStyles.unreadAlertContainer : {}}>
        <TouchableRipple onPress={() => this._onPress(item)}>
          <View style={alertsStyles.alert}>
            <View style={alertsStyles.textInfo}>
              <Text style={alertsStyles.authorText}>{item.author}</Text>
              <Text style={alertsStyles.titleText}>
                {decodeURI(item.title)}
              </Text>
              <Text style={alertsStyles.dateText}>
                {this._getRelativeDate(moment(item.dateString, 'MMM D, YYYY'))}
              </Text>
            </View>
            <View style={alertsStyles.unreadIndicatorContainer}>
              {item.unread ? (
                <View style={alertsStyles.unreadIndicator} />
              ) : null}
            </View>
          </View>
        </TouchableRipple>
      </View>
    );
  }

  render() {
    return (
      <FlatList
        data={[].concat(...this.state.notificationsData)}
        keyExtractor={(item, index) => item.id.toString()}
        renderItem={this._renderRow}
        onScroll={event => {
          let windowHeight = Dimensions.get('window').height,
            height = event.nativeEvent.contentSize.height,
            offset = event.nativeEvent.contentOffset.y;
          if (windowHeight + offset >= height - 200) {
            // Thank you GitHub
            // https://github.com/facebook/react-native/issues/2299
            this._fetchNextNotifications();
          }
        }}
        ListFooterComponent={
          <View style={alertsStyles.lottieContainer}>
            {this.state.notificationsTotalPages !==
            this.state.notificationsLoadedPages ? (
              <Lottie
                style={alertsStyles.lottie}
                ref={animation => {
                  this.animation = animation;
                }}
                loop={true}
                autoPlay={true}
                source={require('../assets/loader.json')}
              />
            ) : (
              <Text style={alertsStyles.disclaimerText}>
                Messages older than 2 weeks are removed from ManageBac
                automatically.
              </Text>
            )}
          </View>
        }
      />
    );
  }
}

const alertsStyles = StyleSheet.create({
  alert: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    paddingVertical: 16
  },
  unreadAlertContainer: {
    backgroundColor: colors.lightBlue2
  },
  unreadIndicatorContainer: {
    width: 32,
    justifyContent: 'center',
    alignItems: 'center'
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.blue
  },
  textInfo: {
    flex: 1
  },
  authorText: {
    ...fonts.jost300
  },
  titleText: {
    ...fonts.jost500
  },
  dateText: {
    color: colors.gray2,
    fontSize: 12,
    ...fonts.jost300
  },
  lottieContainer: {
    paddingTop: 16,
    paddingHorizontal: 16,
    flex: 1,
    alignItems: 'center',
    marginBottom: 16
  },
  lottie: {
    width: 30,
    height: 30
  },
  disclaimerText: {
    marginTop: 16,
    color: colors.gray2
  }
});
