import React from 'react';

import {
  View,
  Text,
} from 'react-native';

import { styles } from '../styles';

export default class HomeScreen extends React.Component {

  render() {

    return (
      <View style={styles.containerAlignChildrenCenter} >
        <Text style={styles.h1}>This is the app!!</Text>
      </View>
    );

  }

}