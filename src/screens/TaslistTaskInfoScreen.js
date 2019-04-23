import React from 'react';

import { View } from 'react-native';

export default class TasklistTaskInfoScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Task information'
    };
  };

  render() {
    return <View />;
  }
}
