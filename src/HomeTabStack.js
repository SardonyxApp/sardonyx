import React from 'react';

import { createStackNavigator } from 'react-navigation';

import {
  Icon
} from 'react-native-elements';

import HomeScreen from './screens/HomeScreen';

// Navigation stack for the Home tab.
const HomeTabStack = createStackNavigator(
  {
    Home: HomeScreen
  },
  {
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#d17b46'
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'normal'
      }
    }
  }
  /*
  , {
    navigationOptions: {}
    Putting tabBarLabel here means applying the label to every child inside the Navigator,
    and not to the Navigator itself. We want to set the name and icon of the tab, so the options
    have to be applied to the Navigator directly after we define it.
  }
  */
);

HomeTabStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ tintColor }) => (
    <Icon name="home" color={tintColor} />
  ),
  tabBarColor: '#fff'
};

export default HomeTabStack;