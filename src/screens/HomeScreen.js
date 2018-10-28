import React from 'react';

import {
  View,
  Text,
} from 'react-native';

import { Storage } from '../helpers';

import { styles } from '../styles';

export default class HomeScreen extends React.Component {
  static navigationOptions({ navigation }) {
    return {
      title: 'Home'
    };
  }

  componentDidMount() {
    Storage.retrieveCredentials().then(credentials => {
      console.log(credentials);
    }).catch(err => {
      console.warn(err);
    });
  }

  render() {
    return (
      <View style={styles.containerAlignChildrenCenter} >
        <Text style={styles.h1}>This is the app!!</Text>
        <Text style={styles.p}>Check console to see your stored credentials.</Text>
      </View>
    );
  }
}