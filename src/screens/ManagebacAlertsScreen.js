import React from 'react';

import { View } from 'react-native';

export default class ManagebacAlertsScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Alerts'
    };
  };

  render() {
    return <View />;
  }
}
