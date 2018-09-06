import React from 'react';

import {
  View,
  Text,
  StatusBar,
  ActivityIndicator,
} from 'react-native';

export default class LoginCheckScreen extends React.Component {

  constructor(props) {
    super(props);
    this._checkAsync();
  }

  _checkAsync = async () => {
    // Check for existing session.
    // This is NOT authenticating credentials for the first time, it is simply checking if the user
    // was logged in last time and if so, continuing to the main App.

    fetch('https://sardonyx.glitch.me/api/validate')
      .then(response => {
        if (response.status === 401) {
          //validation failed
          // Navigate directly to the Login screen instead of the LoginStack, because 
          // 1. We want to ensure the user is lead to the login page, in case any other screens are
          //    added into LoginStack, and the default is changed
          // 2. Parameters (errorMessage) doesn't propagate through Stacks unfortunately, so the
          //    screen itself has to be called.
          this.props.navigation.navigate('Login', {
            errorMessage: 'Login check failed, please try again.',
          });
        }

        else if (response.status === 200) {
          //validation succeeded
          this.props.navigation.navigate('AppStack');
        }
      })
      .catch(error => {
        this.props.navigation.navigate('Login', {
          errorMessage: 'There was an error while validating. Please retry. ' + error,
        });
      });

  }

  render() {
    
    return (
      <View>
        <Text>Recovering session if it exists...</Text>
        <ActivityIndicator />
        <StatusBar hidden={true} />
      </View>
    )
    
  }

}