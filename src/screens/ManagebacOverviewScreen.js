import React from 'react';

import { View } from 'react-native';

export default class ManagebacOverviewScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Overview'
    };
  };

  render() {
    return <View />;
  }
}
