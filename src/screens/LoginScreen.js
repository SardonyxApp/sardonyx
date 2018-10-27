import React from 'react';

import {
  View,
  Text,
  Image,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';

import {
  CheckBox,
  Button
} from 'react-native-elements';

import { WriteManagebacCredentials} from '../helpers';
import { styles, colors, preset } from '../styles';

export default class Login extends React.Component {
  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView style={[styles.alignChildrenCenter, styles.fullScreen]}>
          <View style={preset.loginBox}>
            <Image source={require('../logos/Icon.png')} style={styles.logoIcon} />
            <Text style={[styles.h1, styles.alignCenter]}>Sardonyx</Text>
            <Text style={[styles.p, styles.alignCenter]}>Login with ManageBac</Text>
            <LoginForm navigation={this.props.navigation} />
            <ErrorMessage error={this.props.navigation.getParam('errorMessage', null)} />
          </View>
          <DisclaimerMessage />
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
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
      agreeError: false,
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
        //disable button while sending network requests
        this.toggleButton(true);

        //construct form data to send to ManageBac
        const formData = new FormData();
        formData.append('login', this.state.username);
        formData.append('password', this.state.password);
        formData.append('remember_me', '1');
        this.sendForm(formData);
      }
    });
  }

  validateForm() {
    //regex to match email address
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    //returning a promise because setState does not get immediately reflected
    return new Promise(resolve => {
      //raise error if username is not a valid email address, or if one of the fields are empty
      this.setState({
        usernameError: !emailRegex.test(this.state.username),
        passwordError: this.state.password.length < 1,
        agreeError: !this.state.agree
      }, () => {
        //if there is either error, return false to reject request
        resolve(this.state.usernameError || this.state.passwordError || this.state.agreeError);
      });
    });
  }

  sendForm(formData) {
    fetch('https://sardonyx.app/api/login', { 
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      body: formData,
      mode: 'no-cors',
    }).then(response => {
      if (response.status === 200) {
        //store response tokens
        const credentials = JSON.parse(response.headers.map['login-token']);
        WriteManagebacCredentials(credentials).then(() => {
          this.toggleButton();
          this.props.navigation.navigate('AppStack');
        }).catch(error => {
          this.toggleButton();
          this.props.navigation.navigate('Login', {
            errorMessage: 'There was an error while validating. Please retry. ' + error
          });
        });
      } else {
        this.toggleButton();
        if (response.status === 401) this.props.navigation.navigate('Login', {
          errorMessage: 'Your username and password did not match.'
        });
        else if (response.status === 404) this.props.navigation.navigate('Login', {
          errorMessage: 'Validation failed due to a network error.'
        });
        else this.props.navigation.navigate('Login', {
          errorMessage: 'Validation failed due to an unknown error. Error code: ' + response.status
        });
      }
    }).catch(error => {
      this.toggleButton();
      this.props.navigation.navigate('Login', {
        errorMessage: 'There was an error while validating. Please retry. ' + error
      });
    });
  }

  render() {
    return (
      <View style={{ flexDirection: 'column' }}>

        <TextInput 
          placeholder="Username"
          value={this.state.username}
          style={preset.inputLine}
          textContentType="username"
          keyboardType="email-address"
          returnKeyType="next"
          autoCapitalize="none"
          onChangeText={text => this.setState({
            username: text
          })}
          onSubmitEditing={() => this.passwordInput.focus()}
          blurOnSubmit={false}
        />
        <Text style={[styles.error, styles.alignCenter, this.state.usernameError ? {} : styles.hidden]}>
          Please enter a valid email address.
        </Text>

        <TextInput
          placeholder="Password"
          ref={input => {
            this.passwordInput = input;
          }}
          value={this.state.password}
          style={preset.inputLine}
          textContentType="password"
          keyboardType="default"
          returnKeyType="done"
          autoCapitalize="none"
          secureTextEntry={true}
          onChangeText={text => this.setState({
            password: text 
          })}
        />
        <Text style={[styles.error, styles.alignCenter, this.state.passwordError ? {} : styles.hidden]}>
          Please enter a password.
        </Text>

        <CheckBox 
          title="I agree to the Terms of Service and Privacy Policy"
          checked={this.state.agree}
          checkedColor={colors.black}
          uncheckedColor={colors.black}
          checkedIcon="check-square"
          uncheckedIcon="square-o"
          containerStyle={[styles.transparentBackground, {paddingBottom: 0}]}
          onPress={() => this.setState({
            agree: !this.state.agree
          })}
          textstyle={/*[styles.regular, styles.p]*/ styles.link}
        />
        <Text style={[styles.error, styles.alignCenter, this.state.agreeError ? {} : styles.hidden]}>
          Please agree to the Conditions.
        </Text>

        <Button
          title="Sign in"
          backgroundColor={colors.primary}
          onPress={this.handleSubmit}
          containerViewStyle={styles.padding10}
          disabled={this.state.disabled}
          disabledStyle={{ backgroundColor: colors.lightPrimary }}
        />
        
      </View>
    );
  }
}

function DisclaimerMessage() {
  return (
    <Text style={[styles.small, styles.alignCenter, styles.padding5]}>
      Sardonyx is not affiliated, associated, authorized, endorsed by, or in any way officially connected with ManageBac, or any of its subsidiaries or its affiliates.
    </Text>
  );
}

function ErrorMessage(props) {
  if (props.error) {
    return <Text style={[styles.p, styles.alignCenter, styles.error]}>{props.error}</Text>;
  }
  return null;
}