import React from 'react';

import { ScrollView, RefreshControl, StyleSheet, View } from 'react-native';

import { BASE_URL } from '../../env';

import { Storage } from '../helpers';
import GreetingsCard from '../components/GreetingsCard';
import OverviewHeading from '../components/OverviewHeading';
import UpcomingCarousel from '../components/UpcomingCarousel';
import RoundIconCarousel from '../components/RoundIconCarousel';
import CASExpandableCard from '../components/CASExpandableCard';
import { colors } from '../styles';

export default class ManagebacOverviewScreen extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      refreshing: true,
      upcomingEvents: [], // These three are taken from the dashboard data.
      classList: [], // CAS data is done in the CAS expandable card component
      groupList: [],
      userInfo: {}
    };
    this._onRefresh = this._onRefresh.bind(this);
  }

  static navigationOptions({ navigation }) {
    return {
      title: 'ManageBac'
    };
  }

  componentDidMount() {
    this._getOverviewData().then(data => {
      this.setState({
        refreshing: false,
        upcomingEvents: data.deadlines,
        classList: data.classes,
        groupList: data.groups,
        userInfo: data.user
      });
    });
  }

  /**
   * Set the refreshing controller as visible, and make a request to /dashboard to refresh data.
   */
  _onRefresh() {
    this.setState(
      {
        refreshing: true
      },
      () => {
        Storage.retrieveCredentials()
          .then(credentials => {
            fetch(BASE_URL + '/api/dashboard', {
              method: 'GET',
              headers: {
                'Login-Token': credentials
              },
              mode: 'no-cors'
            }).then(response => {
              if (response.status === 200) {
                Storage.writeValue(
                  'managebacOverview',
                  response.headers.map['managebac-data']
                )
                  .then(() => {
                    const data = JSON.parse(
                      response.headers.map['managebac-data']
                    );
                    this.setState({
                      refreshing: false,
                      upcomingEvents: data.deadlines,
                      classList: data.classes,
                      groupList: data.groups,
                      userInfo: data.user
                    });
                  })
                  .catch(err => {
                    console.warn(err);
                  });
                return;
              }
            });
          })
          .catch(err => {
            console.warn(err);
          });
      }
    );
  }

  /**
   * Asynchronous function that returns a Promise for getting overview data.
   * @return {Promise}
   */
  _getOverviewData() {
    return new Promise(resolve => {
      Storage.retrieveValue('managebacOverview')
        .then(data => {
          resolve(JSON.parse(data));
        })
        .catch(err => {
          console.warn(err);
        });
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
        <GreetingsCard name={this.state.userInfo.name} />
        <OverviewHeading>Upcoming</OverviewHeading>
        <UpcomingCarousel
          upcomingEvents={this.state.upcomingEvents}
          allGroupsAndClasses={[
            ...this.state.classList,
            ...this.state.groupList
          ]}
          navigation={this.props.navigation}
        />
        <OverviewHeading>Classes</OverviewHeading>
        <RoundIconCarousel
          color={colors.primary}
          type={'class'}
          list={this.state.classList}
          navigation={this.props.navigation}
        />
        <OverviewHeading>Groups</OverviewHeading>
        <RoundIconCarousel
          color={colors.lightPrimary}
          type={'group'}
          list={this.state.groupList}
          navigation={this.props.navigation}
        />
        <CASExpandableCard
          expanded={true}
          title="CAS EXPERIENCES"
          navigation={this.props.navigation}
          style={overviewStyles.lastElementPadding}
        />
      </ScrollView>
    );
  }
}

const overviewStyles = StyleSheet.create({
  lastElementPadding: {
    marginBottom: 16
  }
});
