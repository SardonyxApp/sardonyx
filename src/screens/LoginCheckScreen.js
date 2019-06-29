import React from 'react';

import { View, Text, StatusBar, ActivityIndicator } from 'react-native';

import Lottie from 'lottie-react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setManagebacOverview } from '../actions';
import { BASE_URL } from '../../env.json';

import { Storage } from '../helpers';
import { styles, colors, fonts } from '../styles';

class LoginCheckScreen extends React.Component {
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

  async check(credentials = '{}') {
    // Check for existing session
    const response = await fetch(BASE_URL + '/api/validate', {
      method: 'GET',
      headers: {
        'Login-Token': credentials
      },
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
      const credentials = {
        ...JSON.parse(response.headers.map['login-token'] || '{}'),
        ...{ sardonyxToken: response.headers.map['sardonyx-token'] }
      };
      Storage.writeCredentials(credentials);
      this.props.setManagebacOverview(await response.json());
      this.props.navigation.navigate(
        this.props.firstScreenManagebac ? 'ManagebacTabs' : 'TasksTabs'
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

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setManagebacOverview
    },
    dispatch
  );

const mapStateToProps = state => {
  const firstScreenManagebac = state.settings.general.firstScreenManagebac;
  return { firstScreenManagebac };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginCheckScreen);
