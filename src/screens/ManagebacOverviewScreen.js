import React from 'react';

import { ScrollView, RefreshControl } from 'react-native';

import { BASE_URL } from '../../env';

import { Storage } from '../helpers';
import UpcomingExpandableCard from '../components/UpcomingExpandableCard';
import CASExpandableCard from '../components/CASExpandableCard';
import ClassesExpandableCard from '../components/ClassesExpandableCard';
import GroupsExpandableCard from '../components/UpcomingExpandableCard';

export default class ManagebacOverviewScreen extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      refreshing: true,
      upcomingEvents: [], // These three are taken from the dashboard data.
      classList: [], // CAS data is done in the CAS expandable card component
      groupList: []
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
        groupList: data.groups
      });
    });
  }

  /**
   * Set the refreshing controller as visible, and make a request to /dashboard to refresh data.
   */
  _onRefresh() {
    this.setState({
      refreshing: true
    });
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
            ).then(() => {
              this.setState({
                refreshing: false
              });
            }).catch(err => {
              console.warn(err);
            });
            return;
          }
        }); // TODO: Data is loaded but screen is never reloaded fix it
      })
      .catch(err => {
        console.warn(err);
      });
  }

  /**
   * Asynchronous function that returns a Promise for getting overview data.
   * @return {Promise}
   */
  _getOverviewData() {
    return new Promise(resolve => {
      Storage.retrieveValue('managebacOverview').then(data => {
        resolve(JSON.parse(data));
      }).catch(err => {
        console.warn(err);
      });
    });
  }

  /**
   * Put raw deadline data into a array sorted by date to be used in SectionList
   * @param {Array} deadlines
   */
  _sortDeadlineArray(deadlines) {
    let sorted = [];
    deadlines.forEach(deadline => {
      dueDate = Date.parse(deadline.due);
      // If deadline section already exists then put the deadline in there, otherwise create a section
      let index = sorted.findIndex(element => element.title === dueDate);
      if (index !== -1) {
        sorted[index].data.push(deadline);
        return;
      }
      sorted.push({
        title: dueDate,
        data: [deadline]
      });
    });
    return sorted;
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
        <UpcomingExpandableCard
          upcomingEvents={this.state.upcomingEvents}
          allGroupsAndClasses={[
            ...this.state.classList,
            ...this.state.groupList
          ]}
          title="UPCOMING"
          navigation={this.props.navigation}
        />
        <CASExpandableCard
          title="CAS EXPERIENCES"
          navigation={this.props.navigation}
        />
        <ClassesExpandableCard
          title="CLASSES"
          classList={this.state.classList}
          navigation={this.props.navigation}
        />
        <GroupsExpandableCard groupList={this.state.groupList} />
      </ScrollView>
    );
  }
}
