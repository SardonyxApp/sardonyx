import React from 'react';

import { createStackNavigator } from 'react-navigation';

import {
  Icon
} from 'react-native-elements';

import ManagebacScreen from './screens/ManagebacScreen';

import { colors } from './styles';

// Navigation stack for the Managebac tab
const ManagebacStack = createStackNavigator(
  {
    Home: ManagebacScreen
  },
  {
    navigationOptions: {
      headerStyle: {
        backgroundColor: colors.blue,
      },
      headerTintColor: colors.white,
      headerTitleStyle: {
        fontWeight: 'normal'
      }
    }
  }
);

// Applied after definition to prevent it from affecting children
ManagebacStack.navigationOptions = {
  tabBarLabel: 'Managebac',
  tabBarIcon: ({ tintColor }) => (
    <Icon name="globe" type={"feather"} color={tintColor} />
  ),
  tabBarColor: colors.white
};

export default ManagebacStack;