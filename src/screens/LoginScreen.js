import React from 'react';

import {
  View,
  Text,
  Image,
  Linking
} from 'react-native';

import { styles } from '../styles';

export default class Login extends React.Component {

  render() {

    return (
      <View style={styles.containerAlignChildrenCenter}>
        <View style={styles.containerLightBackgroundBox}>
          <Image source={require('../logos/Icon.png')} style={styles.logoIcon} />
          <Text style={[styles.h1, styles.textAlignCenter]}>Welcome</Text>
          <Text style={[styles.p, styles.textAlignCenter]}>Please use your Kokusai High School ManageBac credentials to use Sardonyx</Text>
          <ErrorMessage error={this.props.navigation.getParam('errorMessage', null)} />
        </View>
        <Text style={styles.p}>
          Sardonyx is not affiliated, associated, authorized, endorsed by, or in any way officially connected with ManageBac, or any of its subsidiaries or its affiliates. The official ManageBac website can be found at <Text onPress={() => Linking.openURL('https://www.managebac.com')} style={styles.link}>https://www.managebac.com</Text>.
        </Text>
      </View>
    );

  }

}

class ErrorMessage extends React.Component {

  render() {

    if (this.props.error) {
      return <Text style={[styles.p, styles.textAlignCenter, styles.error]}>{this.props.error}</Text>
    }
    return (null); // Shows nothing

  }

}