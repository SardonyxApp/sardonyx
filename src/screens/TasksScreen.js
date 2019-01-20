import React from 'react';

import {
  View
} from 'react-native';


export default class TasksScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Tasks'
    };
  }

  render() {
    return (<View></View>);
  }
}