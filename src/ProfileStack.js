import React from 'react';

import { createStackNavigator } from 'react-navigation';

import {
  Icon
} from 'react-native-elements';

import ProfileScreen from './screens/ProfileScreen';
import SettingsScreen from './screens/SettingsScreen';

import { colors } from './styles';

// Navigation stack for the Profile tab
const ProfileStack = createStackNavigator(
  {
    Profile: ProfileScreen,
    Settings: SettingsScreen
  }, {
    navigationOptions: {
      tabBarLabel: 'Profile',
      tabBarIcon: ({ tintColor }) => (
        <Icon name="person" color={tintColor} />
      )
    }
  }
);

export default ProfileStack;