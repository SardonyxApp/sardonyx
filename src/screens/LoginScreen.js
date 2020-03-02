import React from 'react';

import {
  Alert,
  View,
  Text,
  Image,
  TextInput,
  TouchableWithoutFeedback,
  Linking,
  Keyboard
} from 'react-native';

import { Button } from 'react-native-elements';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { BASE_URL } from '../../env';

import PreloadImage from '../components/PreloadImage';
import { Storage } from '../helpers';
import { styles, colors, preset, fonts } from '../styles';

export default class Login extends React.Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <PreloadImage
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0
          }}
          sourceUri={'https://i.imgur.com/r7I9fFW.jpg'}
          blurRadius={3}
          resizeMode={'cover'}
        />
        <TouchableWithoutFeedback
          style={{ flex: 1 }}
          onPress={Keyboard.dismiss}
        >
          <View style={[styles.alignChildrenCenter, { flex: 1 }]}>
            <View style={preset.loginBox}>
              <Image
                source={require('../assets/logos/Icon.png')}
                style={styles.logoIcon}
              />
              <Text style={[styles.h1, styles.alignCenter, fonts.jost300]}>
                Sardonyx
              </Text>
              <Text style={[styles.p, styles.alignCenter, fonts.jost400]}>
                Login
              </Text>
              <LoginForm
                navigation={this.props.navigation}
              />
              <ErrorMessage
                error={this.props.navigation.getParam('errorMessage', null)}
              />
            </View>
            <DisclaimerMessage />
            <KeyboardSpacer topSpacing={-150} />
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      agree: false,
      usernameError: false,
      passwordError: false,
      disabled: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  toggleButton(bool = false) {
    this.setState({
      disabled: bool
    });
  }

  handleSubmit() {
    this.validateForm().then(response => {
      if (response) return;
      else {
        // disable button while sending network requests
        this.toggleButton(true);

        const formData = new FormData();
        formData.append('login', this.state.username);
        formData.append('password', this.state.password);
        this.sendForm(formData);
      }
    });
  }

  validateForm() {
    // regex to match email address
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    // returning a promise because setState does not get immediately reflected
    return new Promise(resolve => {
      //raise error if username is not a valid email address, or if one of the fields are empty
      this.setState(
        {
          usernameError: !emailRegex.test(this.state.username),
          passwordError: this.state.password.length < 1
        },
        () => {
          // if there is either error, return false to reject request
          resolve(this.state.usernameError || this.state.passwordError);
        }
      );
    });
  }

  async sendForm(formData) {
    const response = await fetch(BASE_URL + '/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      body: formData,
      mode: 'no-cors'
    }).catch(error => {
      this.toggleButton();
      this.props.navigation.navigate('Login', {
        errorMessage:
          'There was an error while processing your login. Please retry. ' +
          error
      });
    });
    if (response.status === 200) {
      // store response tokens
      const sardonyxToken = response.headers.map['sardonyx-token'];
      try {
        Storage.writeValue('sardonyxToken', sardonyxToken);
        Storage.writeCredentials({
          login: this.state.username,
          password: this.state.password
        })
        this.toggleButton(); // Make button available again
        this.props.navigation.navigate(
          'TasksTabs'
        );
      } catch (e) {
        this.toggleButton();
        this.props.navigation.navigate('Login', {
          errorMessage: 'There was an error while storing login. ' + error
        });
      }
      return;
    }
    this.toggleButton();
    if (response.status === 401)
      Alert.alert(
        '',
        'Your username and password did not match. Please retry.'
      );
    else if (response.status === 404)
      Alert.alert('', 'Validation failed due to a server error.');
    else
      Alert.alert(
        '',
        'Validation failed due to an unknown error: Code ' + response.status
      );
  }

  render() {
    return (
      <View style={{ flexDirection: 'column', width: '100%', marginTop: 16 }}>
        <TextInput
          placeholder="Username"
          value={this.state.username}
          style={[
            preset.inputLine,
            {
              borderBottomWidth: 0.5,
              borderTopRightRadius: 4,
              borderTopLeftRadius: 4
            }
          ]}
          textContentType="username"
          keyboardType="email-address"
          returnKeyType="next"
          autoCapitalize="none"
          onChangeText={text =>
            this.setState({
              username: text
            })
          }
          onSubmitEditing={() => this.passwordInput.focus()}
          blurOnSubmit={false}
        />
        <Text
          style={[
            styles.error,
            styles.alignCenter,
            fonts.jost400,
            this.state.usernameError ? {} : styles.hidden
          ]}
        >
          Please enter a valid email address.
        </Text>

        <TextInput
          placeholder="Password"
          ref={input => {
            this.passwordInput = input;
          }}
          value={this.state.password}
          style={[
            preset.inputLine,
            {
              borderTopWidth: 0.5,
              borderBottomRightRadius: 4,
              borderBottomLeftRadius: 4
            }
          ]}
          textContentType="password"
          keyboardType="default"
          returnKeyType="done"
          autoCapitalize="none"
          secureTextEntry={true}
          onChangeText={text =>
            this.setState({
              password: text
            })
          }
        />
        <Text
          style={[
            styles.error,
            styles.alignCenter,
            fonts.jost400,
            this.state.passwordError ? {} : styles.hidden
          ]}
        >
          Please enter a password.
        </Text>

        <Button
          title="Sign in"
          type="solid"
          onPress={this.handleSubmit}
          buttonStyle={{ backgroundColor: colors.primary }}
          containerStyle={styles.padding10}
          titleStyle={fonts.jost400}
          disabled={this.state.disabled}
          disabledStyle={{ backgroundColor: colors.lightPrimary }}
        />
      </View>
    );
  }
}

function DisclaimerMessage() {
  return (
    <View style={styles.alignCenter}>
      <Text
        style={[
          styles.small,
          styles.alignCenter,
          styles.padding5,
          fonts.jost300
        ]}
      >
        By signing in, you are agreeing to our{' '}
        <Text
          onPress={() => Linking.openURL(BASE_URL + '/terms')}
          style={{ color: colors.primary }}
        >
          Terms of Service
        </Text>{' '}
        and{' '}
        <Text
          onPress={() => Linking.openURL(BASE_URL + '/privacy')}
          style={{ color: colors.primary }}
        >
          Privacy Policy
        </Text>
        .
      </Text>
      <Text
        style={[
          styles.small,
          styles.alignCenter,
          styles.padding5,
          fonts.jost300
        ]}
      >
      </Text>
    </View>
  );
}

function ErrorMessage(props) {
  if (props.error) {
    return (
      <Text style={[styles.p, styles.alignCenter, styles.error, fonts.jost400]}>
        {props.error}
      </Text>
    );
  }
  return null;
}