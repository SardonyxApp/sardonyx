import React from 'react';

import { createStackNavigator } from 'react-navigation';

import {
  Icon
} from 'react-native-elements';

import ProfileScreen from './screens/ProfileScreen';
import SettingsScreen from './screens/SettingsScreen';

// Navigation stack for the Home tab.
const ProfileTabStack = createStackNavigator(
  {
    Profile: ProfileScreen,
    Settings: SettingsScreen
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

ProfileTabStack.navigationOptions = {
  tabBarLabel: 'Profile',
  tabBarIcon: ({ tintColor }) => (
    <Icon name="person" color={tintColor} /> 
  ),
  tabBarColor: '#fff'
};

export default ProfileTabStack;