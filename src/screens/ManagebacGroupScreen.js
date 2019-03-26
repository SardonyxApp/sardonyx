import React from 'react';

import { View } from 'react-native';

export default class ManagebacGroupScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Group'
    };
  };

  render() {
    return <View />;
  }
}
