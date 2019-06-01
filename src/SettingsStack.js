import React from 'react';

import { Text } from 'react-native';

import { createStackNavigator } from 'react-navigation';

import { Icon } from 'react-native-elements';

import SettingsScreen from './screens/SettingsScreen';

import { fonts } from './styles';

// Navigation stack for the Profile tab
const SettingsStack = createStackNavigator(
  {
    Settings: SettingsScreen
  },
  {
    navigationOptions: {
      tabBarLabel: <Text style={fonts.jost400}>Settings</Text>,
      tabBarIcon: ({ tintColor }) => <Icon name="account-settings" type="material-community" color={tintColor} />
    }
  }
);

export default SettingsStack;
