import React from 'react';

import {
  ScrollView,
  View,
  Text,
  InteractionManager,
  StyleSheet,
  RefreshControl
} from 'react-native';

import moment from 'moment';
import { BASE_URL } from '../../env';
import HTMLView from 'react-native-htmlview';

import { Storage } from '../helpers';
import { colors, elevations, fonts } from '../styles';

export default class ManagebacAlertScreen extends React.Component {
  isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      refreshing: true,
      notificationData: []
    };
    this._onRefresh = this._onRefresh.bind(this);
    this._fetchNotificationData = this._fetchNotificationData.bind(this);
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
   * Set the refreshing controller as visible, and call _fetchNotificationsData().
   */
  _onRefresh() {
    this.props.navigation.state.params.refreshOverview();
    this.setState(
      {
        refreshing: true
      },
      async () => {
        this._fetchNotificationData(await Storage.retrieveCredentials());
      }
    );
  }

  /**
   * Fetches details about a single notification.
   * @param {String} credentials
   */
  async _fetchNotificationData(credentials) {
    const response = await fetch(
      BASE_URL +
        '/api/notification/' +
        this.props.navigation.getParam('id', '404'),
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
      this.setState({
        refreshing: false,
        notificationData: parsedManagebacResponse.notification
      });
      return;
    }
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
      >
        <View style={alertStyles.infoText}>
          <Text style={fonts.jost400}>
            From:{' '}
            <Text style={fonts.jost500}>
              {'author' in this.state.notificationData
                ? this.state.notificationData.author
                : ''}
            </Text>
          </Text>

          <Text style={fonts.jost400}>
            Sent on:{' '}
            <Text style={fonts.jost500}>
              {'date' in this.state.notificationData
                ? moment(this.state.notificationData.date).format(
                    'dddd, MMM Do YYYY, H:mm'
                  )
                : ''}
            </Text>
          </Text>
        </View>
        <HTMLView
          style={alertStyles.content}
          value={`<html><body>${
            'content' in this.state.notificationData
              ? this.state.notificationData.content
              : ''
          }</body></html>`}
        />
      </ScrollView>
    );
  }
}

const alertStyles = StyleSheet.create({
  infoText: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.lightBlue2,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.gray2,
    ...elevations.two
  },
  bold: {
    fontWeight: 'bold'
  },
  content: {
    paddingHorizontal: 16
  }
});
