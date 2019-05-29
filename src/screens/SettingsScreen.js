import React from 'react';

import { View } from 'react-native';

import { Button } from 'react-native-elements';

import { colors, styles, fonts } from '../styles';

export default class SettingsScreen extends React.Component {
  constructor(props) {
    super(props);

    this.handleLogout = this.handleLogout.bind(this);
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: 'Settings',
      headerStyle: {
        backgroundColor: colors.primary
      },
      headerTintColor: colors.white,
      headerTitleStyle: {
        fontWeight: 'normal',
        ...fonts.jost400
      }
    };
  };

  handleLogout() {
    this.props.navigation.navigate('Logout');
  }

  render() {
    return (
      <View>
        <Button
          title="Log out"
          onPress={this.handleLogout}
          buttonStyle={{ backgroundColor: colors.primary }}
          containerStyle={styles.padding10}
          titleStyle={fonts.jost400}
        />
      </View>
    );
  }
}
