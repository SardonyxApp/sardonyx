import React from 'react';

import { View, Text, FlatList, StyleSheet, RefreshControl, Alert } from 'react-native';

import { BASE_URL } from 'react-native-dotenv';

import { Storage } from '../helpers';
import { styles } from '../styles';

export default class ManagebacCASScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: true,
    };
    this._onRefresh = this._onRefresh.bind(this);
  }

  componentDidMount() {
    this._onRefresh();
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: `${navigation.state.params.title}`
    };
  };

  _onRefresh() {
    this.setState({
      refreshing: true
    }, () => {
      Storage.retrieveCredentials().then(credentials => {
        fetch(BASE_URL + this.props.navigation.getParam('apiLink', '/404'), {
          method: 'GET',
          headers: {
            'Login-Token': credentials
          },
          mode: 'no-cors'
        }).then(response => {
          if (response.status === 200) {
            this.setState({
              refreshing: false,
              experienceData: JSON.parse(response.headers.map['managebac-data']).cas
            });
            return;
          } else if (response.status === 404) {
            Alert.alert('Not Found', 'Your CAS experience could not be found.', []);
            this.props.navigation.goBack();
            return;
          }
        });
      });
    });
  }

  render() {
    return (null);
  }
}