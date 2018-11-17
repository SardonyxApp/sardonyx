import React from 'react';

import {
  View,
  Text
} from 'react-native';

import {
  Button
} from 'react-native-elements';

import { styles } from '../styles';

export default class ManagebacScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Managebac'
    };
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