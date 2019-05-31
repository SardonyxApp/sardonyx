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

import { DangerZone } from 'expo';
const { Lottie } = DangerZone;
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
      refreshing: true,
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
    setTimeout(() => {
      this.animation.play();
    }, 50);
    InteractionManager.runAfterInteractions(this._onRefresh);
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
   * Set the refreshing controller as visible, and call _fetchNotificationsData().
   */
  _onRefresh() {
    this.setState(
      {
        refreshing: true
      },
      () => {
        Storage.retrieveCredentials()
          .then(this._fetchNotificationsData)
          .catch(err => {
            console.warn(err);
          });
      }
    );
  }

  /**
   * After performing several checks, load the next page of notifications.
   */
  _fetchNextNotifications() {
    if (!this._isMounted) return;
    // Don't call fetch if it's already fetching something
    if (this.state.fetchingMessages) return;
    // Don't call fetch if it's the last page already.
    if (
      this.state.notificationsTotalPages === this.state.notificationsLoadedPages
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
            this._fetchNotificationsData(
              credentials,
              this.state.notificationsLoadedPages + 1
            );
          })
          .catch(err => {
            console.warn(err);
          });
      }
    );
  }

  /**
   * Requests /api/notification for the list of notifications. Sets the state on success.
   * @param {String} credentials
   */
  _fetchNotificationsData(credentials, page = 1) {
    fetch(BASE_URL + '/api/notification?pageId=' + page, {
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
        let notifications = this.state.notificationsData;
        notifications[page - 1] = parsedManagebacResponse.notifications;
        this.setState({
          refreshing: false,
          fetchingMessages: false,
          notificationsData: notifications,
          notificationsTotalPages: parsedManagebacResponse.numberOfPages,
          notificationsLoadedPages: page
        });
        return;
      }
    });
  }

  _onPress(pressedItem) {
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
    this.props.navigation.navigate('Alert', {
      ...pressedItem,
      title: decodeURI(pressedItem.title)
    });
    if (this.props.navigation.getParam('refreshPage', null) !== null) {
      this.props.navigation.state.params.refreshPage();
    }
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
                {moment(item.dateString, 'MMM D, YYYY').fromNow()}
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
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
        }
        data={[].concat(...this.state.notificationsData)}
        keyExtractor={(item, index) => item.id.toString()}
        renderItem={this._renderRow}
        onScroll={event => {
          let windowHeight = Dimensions.get('window').height,
            height = event.nativeEvent.contentSize.height,
            offset = event.nativeEvent.contentOffset.y;
          if (windowHeight + offset >= height) {
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
    fontSize: 12
  },
  lottieContainer: {
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
    marginTop: 32,
    color: colors.gray2
  }
});
