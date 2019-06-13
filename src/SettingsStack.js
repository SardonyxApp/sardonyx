import React from 'react';

import { Text } from 'react-native';

import { createStackNavigator } from 'react-navigation';

import { Icon } from 'react-native-elements';

import SettingsScreen from './screens/SettingsScreen';
import SettingsEditUserLabelsScreen from './screens/SettingsEditUserLabelsScreen';

import { fonts } from './styles';

// Navigation stack for settings tab
const SettingsStack = createStackNavigator(
  {
    Settings: SettingsScreen,
    EditUserLabels: SettingsEditUserLabelsScreen
  },
  {
    navigationOptions: {
      tabBarLabel: <Text style={fonts.jost400}>Settings</Text>,
      tabBarIcon: ({ tintColor }) => <Icon name="account-settings" type="material-community" color={tintColor} />
    }
  }
);

export default SettingsStack;
