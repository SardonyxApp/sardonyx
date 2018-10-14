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

import { styles, colors, preset } from '../styles';

export default class Login extends React.Component {
  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView style={[styles.alignChildrenCenter, styles.fullScreen]}>
          <View style={preset.loginBox}>
            <Image source={require('../logos/Icon.png')} style={styles.logoIcon} />
            <Text style={[styles.h1, styles.alignCenter]}>Welcome</Text>
            <Text style={[styles.p, styles.alignCenter]}>Login with ManageBac</Text>
            <LoginForm />
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
      disabled: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    this.setState({
      disabled: true
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
          onChangeText={text => this.setState({
            username: text
          })}
        />
        <Text style={[styles.hidden, styles.error]}>Please enter a username.</Text>

        <TextInput
          placeholder="Password"
          value={this.state.password}
          style={preset.inputLine}
          textContentType="password"
          keyboardType="default"
          secureTextEntry={true}
          onChangeText={text => this.setState({
            password: text 
          })}
        />
        <Text style={[styles.hidden, styles.error]}>Please enter a password.</Text>

        <CheckBox 
          title="I agree to the Terms of Service and Privacy Policy"
          checked={this.state.agree}
          checkedColor={colors.black}
          uncheckedColor={colors.black}
          checkedIcon="check-square"
          uncheckedIcon="square-o"
          containerStyle={styles.transparentBackground}
          onPress={() => this.setState({
            agree: !this.state.agree
          })}
          textstyle={/*[styles.regular, styles.p]*/ styles.link}
        />

        <Button
          title="Sign in"
          backgroundColor={colors.primary}
          onPress={this.handleSubmit}
          disabled={this.state.disabled}
          disabledStyle={{ backgroundColor: colors.lightPrimary }}
        />
        
      </View>
    );
  }
}

function DisclaimerMessage() {
  return (
    <Text style={[styles.tiny, styles.alignCenter, styles.padding5]}>
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