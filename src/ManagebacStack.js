import React from 'react';

import { Dimensions, Text } from 'react-native';

import {
  createStackNavigator,
  createMaterialTopTabNavigator
} from 'react-navigation';

import { Icon } from 'react-native-elements';

import ManagebacOverviewScreen from './screens/ManagebacOverviewScreen';
import ManagebacCASScreen from './screens/ManagebacCASScreen';
// Dummy screens
import ManagebacCalendarScreen from './screens/ManagebacScreen';
import ManagebacClassesScreen from './screens/ManagebacScreen';
import ManagebacGroupsScreen from './screens/ManagebacScreen';
import MessagesScreen from './screens/SettingsScreen';

import { colors, fonts } from './styles';

const ManagebacTabs = createMaterialTopTabNavigator(
  {
    Overview: ManagebacOverviewScreen,
    CAS: ManagebacCASScreen,
    Calendar: ManagebacCalendarScreen,
    Groups: ManagebacClassesScreen,
    Groups: ManagebacGroupsScreen
  },
  {
    navigationOptions: {
      title: 'ManageBac'
    },
    initialLayout: {
      height: 0,
      width: Dimensions.get('window').width
    },
    tabBarOptions: {
      scrollEnabled: true,
      style: {
        backgroundColor: colors.blue
      },
      indicatorStyle: {
        backgroundColor: colors.white
      },
      labelStyle: {
        ...fonts.jost400
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
      tabBarLabel: <Text style={fonts.jost400}>ManageBac</Text>,
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
        fontWeight: 'normal',
        ...fonts.jost400
      }
    }
  }
);

export default ManagebacStack;
