import React from 'react';

import {
  View,
  Text,
  Image
} from 'react-native';

import { CheckBox } from 'react-native-elements';

import { styles, colors, preset } from '../styles';

export default class Login extends React.Component {
  render() {
    return (
      <View style={[styles.alignChildrenCenter, styles.fullScreen]}>
        <View style={preset.loginBox}>
          <Image source={require('../logos/Icon.png')} style={styles.logoIcon} />
          <Text style={[styles.h1, styles.alignCenter]}>Welcome</Text>
          <Text style={[styles.p, styles.alignCenter]}>Login with ManageBac</Text>
          <LoginForm />
          <ErrorMessage error={this.props.navigation.getParam('errorMessage', null)} />
        </View>
        <Text style={[styles.tiny, styles.alignCenter, styles.padding5]}>
          Sardonyx is not affiliated, associated, authorized, endorsed by, or in any way officially connected with ManageBac, or any of its subsidiaries or its affiliates.
        </Text>
      </View>
    );
  }
}

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      agree: false
    };
  }
  render() {
    return (
      <View>
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
          textstyle={[styles.regular, styles.p]}
        />
      </View>
    );
  }
}

class ErrorMessage extends React.Component {
  render() {
    if (this.props.error) {
      return <Text style={[styles.p, styles.alignCenter, styles.error]}>{this.props.error}</Text>;
    }
    return (null); // Shows nothing
  }
}