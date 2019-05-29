import React from 'react';

import { View, Text } from 'react-native';

import { Button } from 'react-native-elements';

import { Storage } from '../helpers';
import { styles, colors, fonts } from '../styles';

export default class LogoutScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: ''
    };
    this.logout();

    this.handlePress = this.handlePress.bind(this);
  }

  logout() {
    Storage.deleteCredentials().catch(err => {
      console.error(err);
      this.setState({
        errorMessage: 'There was an error logging out: ' + error
      });
    });
  }

  handlePress() {
    this.props.navigation.navigate('Login', {
      errorMessage: null
    });
  }

  render() {
    return (
      <View style={[styles.alignChildrenCenter, { flex: 1 }]}>
        <Text style={[styles.p, styles.alignCenter]}>{this.state.errorMessage}</Text>
        <Button 
          title="Go to Login"
          type="solid"
          buttonStyle={{ backgroundColor: colors.primary }}
          containerStyle={styles.padding10}
          titleStyle={fonts.jost400}
          onPress={this.handlePress}
        />
      </View>
    );
  }
}