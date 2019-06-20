import React from 'react';

import {
  ScrollView,
  RefreshControl,
  StyleSheet,
  InteractionManager
} from 'react-native';

import { Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setManagebacOverview } from '../actions';
import { BASE_URL } from '../../env';

import { Storage } from '../helpers';
import HeaderIcon from '../components/HeaderIcon';
import GreetingsCard from '../components/GreetingsCard';
import OverviewHeading from '../components/OverviewHeading';
import UpcomingCarousel from '../components/UpcomingCarousel';
import RoundIconCarousel from '../components/RoundIconCarousel';
import CASExpandableCard from '../components/CASExpandableCard';
import { colors } from '../styles';

class ManagebacOverviewScreen extends React.PureComponent {
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
      title: 'ManageBac',
      headerRight: (
        <HeaderIcon
          onPress={() => {
            navigation.navigate('Alerts', {
              refreshPage: navigation.state.params.refreshPage
            });
          }}
        >
          <Icon
            name={
              navigation.state.params &&
              navigation.state.params.notificationCount
                ? 'notifications-active'
                : 'notifications-none'
            }
            color={colors.white}
          />
        </HeaderIcon>
      )
    };
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        refreshing: false,
        upcomingEvents: this.props.overview.deadlines,
        groupList: this.props.overview.groups,
        classList: this.props.overview.classes,
        userInfo: this.props.overview.user
      });
      this.props.navigation.setParams({
        refreshPage: this._onRefresh,
        notificationCount: this.props.overview.notificationCount
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
      async () => {
        const credentials = await Storage.retrieveCredentials();
        const response = await fetch(BASE_URL + '/api/dashboard', {
          method: 'GET',
          headers: {
            'Login-Token': credentials
          },
          mode: 'no-cors'
        });
        if (response.status === 200) {
          this.props.setManagebacOverview(await response.json());
          this.setState({
            refreshing: false
          });
          this.props.navigation.setParams({
            notificationCount: this.props.overview.notificationCount
          });
          return;
        }
      }
    );
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
        <GreetingsCard name={this.props.overview.user.name} />
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

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setManagebacOverview
    },
    dispatch
  );

const mapStateToProps = state => {
  const overview = state.managebac.overview;
  return { overview };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ManagebacOverviewScreen);
