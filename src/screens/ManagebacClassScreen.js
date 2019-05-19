import React from 'react';

import { ScrollView, RefreshControl, Alert } from 'react-native';

import { BASE_URL } from '../../env';

import UpcomingCarousel from '../components/UpcomingCarousel';
import { Storage } from '../helpers';

export default class ManagebacClassScreen extends React.Component {
  isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      refreshing: true,
      classUpcomingEventsData: [],
      classCompletedEventsData: [],
      classMessagesData: []
    };
    this._onRefresh = this._onRefresh.bind(this);
    this._fetchClassOverviewData = this._fetchClassOverviewData.bind(this);
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
   * Called on load, and on pull-to-refresh. Asynchronously sets the state using newest class data.
   */
  _onRefresh() {
    this.setState(
      {
        refreshing: true
      },
      () => {
        Storage.retrieveCredentials()
          .then(this._fetchClassOverviewData)
          .catch(err => {
            console.warn(err);
          });
      }
    );
  }

  /**
   * Called on load, and on pull-to-refresh. Asynchronously sets the state using newest class data.
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
          upcomingEvents={this.state.classUpcomingEventsData}
          completedEvents={this.state.classCompletedEventsData}
          allGroupsAndClasses={[this.props.navigation.state.params]}
          navigation={this.props.navigation}
        />
      </ScrollView>
    );
  }
}
