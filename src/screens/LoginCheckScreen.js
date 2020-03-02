import React from 'react';

import { View, Text, StatusBar, ActivityIndicator } from 'react-native';

import Lottie from 'lottie-react-native';
import { BASE_URL } from '../../env.json';

import { Storage, toFormData } from '../helpers';
import { styles, colors, fonts } from '../styles';

export default class LoginCheckScreen extends React.Component {
  constructor(props) {
    super(props);
    Storage.retrieveCredentials()
      .then(credentials => {
        this.check(credentials);
      })
      .catch(err => {
        console.warn(err);
        this.check();
      });
  }

  async check(credentials = {}) {
    // Check for existing session
    const response = await fetch(BASE_URL + '/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      body: toFormData(credentials),
      mode: 'no-cors'
    }).catch(error => {
      // promise rejected
      this.props.navigation.navigate('Login', {
        errorMessage: 'There was an error while validating. ' + error
      });
      return;
    });
    if (response.status === 200) {
      // Validation succeeded
      Storage.writeValue("sardonyxToken", response.headers.map['sardonyx-token']);
      this.props.navigation.navigate(
        'TasksTabs'
      );
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
      errorMessage:
        'Validation failed due to an unknown error. Error code: ' +
        response.status
    });
  }

  render() {
    return (
      <View style={[styles.alignChildrenCenter, { flex: 1 }]}>
        <Lottie
          style={{
            width: 100,
            height: 100
          }}
          ref={animation => {
            this.animation = animation;
          }}
          loop={true}
          autoPlay={true}
          source={require('../assets/logos/animatedLogo.json')}
        />
        <Text style={fonts.jost400}>Logging in...</Text>
        <ActivityIndicator color={colors.primary} />
        <StatusBar hidden={true} />
      </View>
    );
  }
}
