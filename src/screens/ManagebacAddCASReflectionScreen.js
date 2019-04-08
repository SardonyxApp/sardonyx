import React from 'react';

import { View } from 'react-native';

export default class ManagebacAddCASReflectionScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Write New Reflection'
    };
  };

  render() {
    return <View />;
  }
}
