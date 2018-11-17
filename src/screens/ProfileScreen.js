import React from 'react';

import {
  View
} from 'react-native';


export default class ProfileScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions({ navigation }) {
    return {
      title: 'Profile'
    };
  }

  render() {
    return (<View></View>)
  }
}