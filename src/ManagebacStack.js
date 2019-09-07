import React from 'react';

import { Text } from 'react-native';

import { createStackNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';

import ManagebacAlertsScreen from './screens/ManagebacAlertsScreen';
import ManagebacAlertScreen from './screens/ManagebacAlertScreen';
import ManagebacOverviewScreen from './screens/ManagebacOverviewScreen';
import ManagebacEventScreen from './screens/ManagebacEventScreen';
import ManagebacCASScreen from './screens/ManagebacCASScreen';
import ManagebacEditCASScreen from './screens/ManagebacEditCASScreen';
import ManagebacViewCASReflectionsScreen from './screens/ManagebacViewCASReflectionsScreen';
import ManagebacClassScreen from './screens/ManagebacClassScreen';
import ManagebacGroupScreen from './screens/ManagebacGroupScreen';
import ManagebacMessageThreadScreen from './screens/ManagebacMessageThreadScreen';

import { colors, fonts } from './styles';
import NotificationBadge from './components/NotificationBadge';

// Navigation stack for the Managebac tab
const ManagebacStack = createStackNavigator(
  {
    Alerts: ManagebacAlertsScreen,
    Alert: ManagebacAlertScreen,
    Overview: ManagebacOverviewScreen,
    UpcomingEventItem: ManagebacEventScreen,
    CASItem: ManagebacCASScreen,
    EditCASItem: ManagebacEditCASScreen,
    ViewCASReflections: ManagebacViewCASReflectionsScreen,
    ClassItem: ManagebacClassScreen,
    GroupItem: ManagebacGroupScreen,
    MessageThread: ManagebacMessageThreadScreen
  },
  {
    initialRouteName: 'Overview',
    navigationOptions: {
      tabBarLabel: <Text style={fonts.jost400}>ManageBac</Text>,
      tabBarIcon: ({ tintColor }) => (
        <React.Fragment>
          <Icon name="globe" type={'feather'} color={tintColor} />
          <NotificationBadge style={{ right: -16 }} />
        </React.Fragment>
      )
    },
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: colors.blue
      },
      headerTintColor: colors.white,
      headerTitleStyle: {
        fontWeight: 'normal',
        ...fonts.jost400
      }
    }
  }
);

export default ManagebacStack;
