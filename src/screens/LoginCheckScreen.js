import React from 'react';

import {
  View,
  Text,
  StatusBar,
  ActivityIndicator,
  Image
} from 'react-native';

import { RetrieveManagebacCredentials } from '../helpers';
import { styles } from '../styles';

export default class LoginCheckScreen extends React.Component {
  constructor(props) {
    super(props);
    RetrieveManagebacCredentials().then(credentials => {
      this.check(credentials);
    }).catch(err => {
      console.warn(err);
      this.check();
    });
  }

  check(credentials = '{}') {
    //check for existing session
    fetch('https://sardonyx.app/api/validate', {
      method: 'GET',
      headers: {
        'Login-Token': credentials
      },
      mode: 'no-cors'
    }).then(response => {
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
        }

        else if (response.status === 200) {
          // validation succeeded
          this.props.navigation.navigate('AppStack');
        }

        else {
          // other error code
          this.props.navigation.navigate('Login', {
            errorMessage: 'Validation failed due to a network error.'
          });
        }
      })
      .catch(error => {
        // promise rejected
        this.props.navigation.navigate('Login', {
          errorMessage: 'There was an error while validating. Please retry. ' + error
        });
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