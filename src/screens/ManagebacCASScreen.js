import React from 'react';

import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';

import { BASE_URL } from 'react-native-dotenv';

import { Storage } from '../helpers';
import { styles } from '../styles';

export default class ManagebacCASScreen extends React.Component {
  constructor(props) {
    super(props);
    this.componentOnFocus = this.componentOnFocus.bind(this);
    this._onRefresh = this._onRefresh.bind(this);
    this.props.navigation.addListener('didFocus', this.componentOnFocus);
    this.state = {
      refreshing: true,
      casExperiences: []
    };
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'CAS'
    };
  };

  componentOnFocus(payload) {
    if (this.state.casExperiences.length !== 0) return;
    this._onRefresh();
  }

  _onRefresh() {
    this.setState({
      refreshing: true
    });
    Storage.retrieveCredentials().then(credentials => {
      fetch(BASE_URL + '/api/cas', {
        method: 'GET',
        headers: {
          'Login-Token': credentials
        },
        mode: 'no-cors'
      }).then(response => {
        if (response.status === 200) {
          this.setState({
            refreshing: false,
            casExperiences: JSON.parse(response.headers.map['managebac-data']).cas
          });
          return;
        }
      });
    });
  }

  render() {
    return (
      <FlatList
        contentContainerStyle={[CASListStyles.list, styles.lightBackground]}
        refreshControl={(
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
        )}
        data={this.state.casExperiences}
        renderItem={({ item }) => <Text>{item.link}</Text>}
      />
    );
  }
}

const CASListStyles = StyleSheet.create({
  list: {
    paddingBottom: 24,
    minHeight: '100%'
  }
});
