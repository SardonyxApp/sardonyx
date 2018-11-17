import React from 'react';

import {
  View
} from 'react-native';


export default class ChatScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Chat'
    };
  }

  render() {
    return (<View></View>);
  }
}