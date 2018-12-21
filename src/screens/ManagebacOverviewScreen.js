import React from 'react';

import { View } from 'react-native';

import { Storage } from '../helpers';

export default class ManagebacOverviewScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions({ navigation }) {
    return {
      title: 'Overview'
    };
  };

  componentDidMount() {
    this._getOverviewData();
  }
  
  _getOverviewData() {
    Storage.retrieveValue('managebacOverview').then((data) => {
      console.log(data);
    });
  };

  render() {
    return <View />;
  }
}
