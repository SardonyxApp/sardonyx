import React from 'react';

import { Text } from 'react-native';

import { createStackNavigator } from 'react-navigation';

import { Icon } from 'react-native-elements';

import ProfileScreen from './screens/ProfileScreen';
import SettingsScreen from './screens/SettingsScreen';

import { fonts } from './styles';

// Navigation stack for the Profile tab
const ProfileStack = createStackNavigator(
  {
    Profile: ProfileScreen,
    Settings: SettingsScreen
  },
  {
    navigationOptions: {
      tabBarLabel: <Text style={fonts.jost400}>Profile</Text>,
      tabBarIcon: ({ tintColor }) => <Icon name="person" color={tintColor} />
    }
  }
);

export default ProfileStack;
