import React from 'react';

import {
  createStackNavigator,
  createMaterialTopTabNavigator
} from 'react-navigation';

import { Icon } from 'react-native-elements';

import ManagebacOverviewScreen from './screens/ManagebacOverviewScreen';
// Dummy screens
import ManagebacCalendarScreen from './screens/ManagebacScreen';
import ManagebacClassesScreen from './screens/ManagebacScreen';
import ManagebacGroupsScreen from './screens/ManagebacScreen';
import ManagebacCASScreen from './screens/ManagebacScreen';
import MessagesScreen from './screens/SettingsScreen';

import { colors } from './styles';

const ManagebacTabs = createMaterialTopTabNavigator(
  {
    Overview: ManagebacOverviewScreen,
    Calendar: ManagebacCalendarScreen,
    Groups: ManagebacClassesScreen,
    Groups: ManagebacGroupsScreen,
    CAS: ManagebacCASScreen
  },
  {
    navigationOptions: {
      title: 'ManageBac'
    },
    tabBarOptions: {
      scrollEnabled: true,
      style: {
        backgroundColor: colors.blue
      },
      indicatorStyle: {
        backgroundColor: colors.white
      }
    }
  }
);
// Navigation stack for the Managebac tab
const ManagebacStack = createStackNavigator(
  {
    Managebac: ManagebacTabs,
    Messages: MessagesScreen
  },
  {
    navigationOptions: {
      tabBarLabel: 'ManageBac',
      tabBarIcon: ({ tintColor }) => (
        <Icon name="globe" type={'feather'} color={tintColor} />
      )
    },
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: colors.blue,
        elevation: 0
      },
      headerTintColor: colors.white,
      headerTitleStyle: {
        fontWeight: 'normal'
      }
    }
  }
);

export default ManagebacStack;
