import React from 'react';

import {
  View
} from 'react-native';

import { colors } from '../styles';

export default class SettingsScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions({ navigation }) {
    return {
      headerTitle: 'Settings',
      headerStyle: {
        backgroundColor: colors.primary
      },
      headerTintColor: colors.white,
      headerTitleStyle: {
        fontWeight: 'normal'
      }
    }
  }

  render() {
    return (<View></View>)
  }
}