import React from 'react';

import { View } from 'react-native';

export default class ManagebacEventScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Event'
    };
  };

  render() {
    return <View />;
  }
}
