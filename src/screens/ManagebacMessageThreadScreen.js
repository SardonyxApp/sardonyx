import React from 'react';

import { View } from 'react-native';

import { BASE_URL } from '../../env';

import { Storage } from '../helpers';

export default class ManagebacMessageThreadScreen extends React.Component {
  isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      refreshing: true
    };
    this._onRefresh = this._onRefresh.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    this._onRefresh();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: `${navigation.state.params.title}`
    };
  };

  /**
   * Called on load, and on pull-to-refresh. Asynchronously sets the state using newest group data.
   */
  _onRefresh() {
    this.setState(
      {
        refreshing: true
      },
      () => {
        Storage.retrieveCredentials()
          .then(this._fetchMessageThreadData)
          .catch(err => {
            console.warn(err);
          });
      }
    );
  }

  /**
   * Sends a GET request to the API, sets State, and show Alert on error.
   * @param {String} credentials
   */
  _fetchGroupOverviewData(credentials) {
    let url = this.props.navigation.getParam('link', '/404');
    fetch(BASE_URL + url, {
      method: 'GET',
      headers: {
        'Login-Token': credentials
      },
      mode: 'no-cors'
    }).then(response => {
      if (!this._isMounted) return;
      if (response.status === 200) {
        const parsedManagebacResponse = JSON.parse(
          response.headers.map['managebac-data']
        );
        this.setState({
          refreshing: false
        });
        return;
      } else if (response.status === 404) {
        Alert.alert('Not Found', 'Message could not be found.', []);
        this.props.navigation.goBack();
        return;
      }
    });
  }

  render() {
    return <View />;
  }
}
