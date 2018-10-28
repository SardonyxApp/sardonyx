import React from 'react';

import {
  View,
  Text
} from 'react-native';

import {
  Button
} from 'react-native-elements';

import { Storage } from '../helpers';

import { styles, colors } from '../styles';

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);

    this.handlePress = this.handlePress.bind(this);
  }

  static navigationOptions({ navigation }) {
    return {
      title: 'Home'
    };
  }

  componentDidMount() {
    Storage.retrieveCredentials().then(credentials => {
      console.log(credentials);
    }).catch(err => {
      console.warn(err);
    });
  }

  handlePress() {
    this.props.navigation.navigate('Logout');
  }

  render() {
    return (
      <View style={styles.containerAlignChildrenCenter} >
        <Text style={styles.h1}>This is the app!!</Text>
        <Text style={styles.p}>Check console to see your stored credentials.</Text>
        <Button 
          title='Log out' 
          onPress={this.handlePress}
          backgroundColor={colors.primary} 
          containerViewStyle={styles.padding10}
        />
      </View>
    );
  }
}