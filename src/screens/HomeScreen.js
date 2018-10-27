import React from 'react';

import {
  View,
  Text,
} from 'react-native';

import { RetrieveManagebacCredentials } from '../helpers';

import { styles } from '../styles';

export default class HomeScreen extends React.Component {
  static navigationOptions({ navigation }) {
    return {
      title: 'Home'
    };
  }

  componentDidMount() {
    RetrieveManagebacCredentials().then(credentials => {
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