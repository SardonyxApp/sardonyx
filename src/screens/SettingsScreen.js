import React from 'react';

import {
  View
} from 'react-native';

export default class SettingsScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions({ navigation }) {
    return {
      headerTitle: 'Settings',
      headerStyle: {
        backgroundColor: '#d17b46'
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'normal'
      }
    }
  }

  render() {
    return (<View></View>)
  }
}