import React from 'react';

import {
  View
} from 'react-native';

import { Icon } from 'react-native-elements';
import HeaderIcon from '../components/HeaderIcon';

import { colors, fonts } from '../styles';

export default class ProfileScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: 'Profile',
      headerStyle: {
        backgroundColor: colors.white
      },
      headerTintColor: colors.primary,
      headerTitleStyle: {
        fontWeight: 'normal',
        ...fonts.jost400
      },
      headerRight: (
      <HeaderIcon onPress={() => {navigation.navigate('Settings')}}><Icon
        name="settings"
        color={colors.primary}
        /></HeaderIcon>)
    }
  }

  render() {
    return (<View></View>);
  }
}