import React from 'react';

import {
  View,
  Text,
} from 'react-native';

import { SecureStore } from 'expo';

import { styles } from '../styles';

export default class HomeScreen extends React.Component {
  static navigationOptions({ navigation }) {
    return {
      title: 'Home'
    };
  }

  componentDidMount() {
    Promise.all([
      SecureStore.getItemAsync('credentials'),
      SecureStore.getItemAsync('cfdiud'),
      SecureStore.getItemAsync('managebacSession')
    ]).then(response => {
      console.log(response);
    }).catch(error => console.warn(error));
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