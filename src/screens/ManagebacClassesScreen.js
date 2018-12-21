import React from 'react';

import { View } from 'react-native';

export default class ManagebacClassesScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Classes'
    };
  };

  render() {
    return <View />;
  }
}
