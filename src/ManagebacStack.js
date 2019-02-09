import React from 'react';

import { Dimensions, Text } from 'react-native';

import {
  createStackNavigator
} from 'react-navigation';

import { Icon } from 'react-native-elements';

import ManagebacAlertsScreen from './screens/ManagebacAlertsScreen';
import ManagebacOverviewScreen from './screens/ManagebacOverviewScreen';
import ManagebacEventScreen from './screens/ManagebacEventScreen';
import ManagebacCASScreen from './screens/ManagebacCASScreen';
import ManagebacClassScreen from './screens/ManagebacClassScreen';
import ManagebacGroupScreen from './screens/ManagebacGroupScreen';

import { colors, fonts } from './styles';

// Navigation stack for the Managebac tab
const ManagebacStack = createStackNavigator(
  {
    Messages: ManagebacAlertsScreen,
    Overview: ManagebacOverviewScreen,
    UpcomingEventItem: ManagebacEventScreen,
    CASItem: ManagebacCASScreen,
    ClassItem: ManagebacClassScreen,
    GroupItem: ManagebacGroupScreen
  },
  {
    initialRouteName: 'Overview',
    navigationOptions: {
      tabBarLabel: <Text style={fonts.jost400}>ManageBac</Text>,
      tabBarIcon: ({ tintColor }) => (
        <Icon name="globe" type={'feather'} color={tintColor} />
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
