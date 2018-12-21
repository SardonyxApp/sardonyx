import React from 'react';

import {
  View,
  Text,
  StatusBar,
  ActivityIndicator,
  Image
} from 'react-native';

import { BASE_URL } from 'react-native-dotenv';

import { Storage } from '../helpers';
import { styles } from '../styles';

export default class LoginCheckScreen extends React.Component {
  constructor(props) {
    super(props);
    Storage.retrieveCredentials().then(credentials => {
      this.check(credentials);
    }).catch(err => {
      console.warn(err);
      this.check();
    });
  }

  check(credentials = '{}') {
    // Check for existing session
    fetch(BASE_URL + '/api/validate', {
      method: 'GET',
      headers: {
        'Login-Token': credentials
      },
      mode: 'no-cors'
    }).then(response => {
      if (response.status === 200) {
        // Validation succeeded
        const credentials = JSON.parse(response.headers.map['login-token'] || '{}');
        Storage.writeCredentials(credentials).then(() => {
          Storage.writeValue('managebacOverview', response.headers.map['managebac-data']).then(() => {
            this.props.navigation.navigate('AppStack');
          });
        });
        return;
      }

      if (response.status === 401) {
        /* 
        Validation failed: unauthorized
        Produce no error message because this is initial login
        Navigate directly to LoginScreen instead of LoginStack, because
        1. User should be led to LoginPage instead of default page of LoginStack
        2. errorMessage doesn't propagate through stacks
        */
        this.props.navigation.navigate('Login', {
          errorMessage: null
        });
        return;
      }

      if (response.status === 404) {
        // Network error
        this.props.navigation.navigate('Login', {
          errorMessage: 'Validation failed due to a network error.'
        });
        return;
      }

      // Other error code
      this.props.navigation.navigate('Login', {
        errorMessage: 'Validation failed due to an unkown error. Error code: ' + response.status
      });
    })
    .catch(error => {
      // promise rejected
      this.props.navigation.navigate('Login', {
        errorMessage: 'There was an error while validating. ' + error
      });
      return;
    });
  }

  render() {
    return (
      <View style={[styles.alignChildrenCenter, styles.fullScreen]}>
        <Image source={require('../logos/Icon.png')} style={styles.logoIcon} />
        <Text>Recovering session if it exists...</Text>
        <ActivityIndicator />
        <StatusBar hidden={true} />
      </View>
    );
  }

}