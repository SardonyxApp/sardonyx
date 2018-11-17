import React from 'react';

import {
  View
} from 'react-native';

import { Icon } from 'react-native-elements';
import HeaderIcon from '../components/HeaderIcon';

export default class ProfileScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: 'Profile',
      headerStyle: {
        backgroundColor: '#fff'
      },
      headerTintColor: '#d17b46',
      headerTitleStyle: {
        fontWeight: 'normal'
      },
      headerRight: (
      <HeaderIcon onPress={() => {navigation.navigate('Settings')}}><Icon
        name="settings"
        color={"#d17b46"}
        /></HeaderIcon>)
    }
  }

  render() {
    return (<View></View>)
  }
}