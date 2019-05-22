import React from 'react';

import { ScrollView, RefreshControl, Alert } from 'react-native';

import { BASE_URL } from '../../env';

import UpcomingCarousel from '../components/UpcomingCarousel';
import { Storage } from '../helpers';

export default class ManagebacGroupScreen extends React.Component {
  isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      refreshing: true,
      groupUpcomingEventsData: [],
      groupCompletedEventsData: [],
      groupMessagesData: []
    };
    this._onRefresh = this._onRefresh.bind(this);
    this._fetchGroupOverviewData = this._fetchGroupOverviewData.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    this._onRefresh();
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
      () => {
        Storage.retrieveCredentials()
          .then(this._fetchGroupOverviewData)
          .catch(err => {
            console.warn(err);
          });
      }
    );
  }

  /**
   * Sends a GET request to the API, sets State, and show Alert on error.
   * @param {String} credentials
   */
  _fetchGroupOverviewData(credentials) {
    let url = this.props.navigation.getParam('link', '/404');
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
          groupUpcomingEventsData: parsedManagebacResponse.deadlines
        });
        return;
      } else if (response.status === 404) {
        Alert.alert('Not Found', 'Group could not be found.', []);
        this.props.navigation.goBack();
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
      >
        <UpcomingCarousel
          upcomingEvents={this.state.groupUpcomingEventsData}
          allGroupsAndClasses={[this.props.navigation.state.params]}
          navigation={this.props.navigation}
        />
      </ScrollView>
    );
  }
}
