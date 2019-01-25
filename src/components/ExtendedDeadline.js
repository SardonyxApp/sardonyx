import React from 'react';

import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  FlatList
} from 'react-native';

import { BASE_URL } from 'react-native-dotenv';

import { Storage } from '../helpers';
import { labelColors, colors, fonts } from '../styles';
import HTMLView from 'react-native-htmlview';

export default class ExtendedDeadline extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: true,
      error: false,
      detail: {}
    };
    this._getDeadlineData = this._getDeadlineData.bind(this);
  }

  componentDidMount() {
    this._getDeadlineData().then(data => {
      console.log(data);
      let hasError = !('assignment' in data);
      !this.isCancelled &&
        this.setState({
          refreshing: false,
          error: hasError,
          detail: data.assignment || {}
        });
    });
  }

  componentWillUnmount() {
    this.isCancelled = true;
  }

  _getDeadlineData() {
    return new Promise(resolve => {
      Storage.retrieveCredentials().then(credentials => {
        fetch(BASE_URL + this.props.id, {
          method: 'GET',
          headers: {
            'Login-Token': credentials
          },
          mode: 'no-cors'
        }).then(response => {
          if (response.status === 200) {
            resolve(JSON.parse(response.headers.map['managebac-data']));
          }
        });
      });
    });
  }

  _renderLabel(name, index) {
    let color = labelColors(name);
    return (
      <View
        key={index}
        style={{ ...extendedDeadlineStyles.label, backgroundColor: color }}
      >
        <Text style={[extendedDeadlineStyles.labelText, fonts.jost400]}>{name.toUpperCase()}</Text>
      </View>
    );
  }

  render() {
    return (
      <View {...this.props}>
        {this.state.refreshing && (
          <ActivityIndicator size="large" color={colors.blue} />
        )}
        {!this.state.refreshing && (
          <View>
            <View style={extendedDeadlineStyles.labels}>
              {this.state.detail.labels.map(this._renderLabel)}
            </View>
            <HTMLView
              value={this.state.detail.details || ''}
              stylesheet={htmlStyles}
            />
          </View>
        )}
      </View>
    );
  }
}

const extendedDeadlineStyles = StyleSheet.create({
  labels: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 8
  },
  label: {
    padding: 2,
    paddingHorizontal: 8
  },
  labelText: {
    color: colors.white,
    fontSize: 9
  }
});

const htmlStyles = StyleSheet.create({
  p: {
    fontSize: 14,
    ...fonts.jost400
  },
  li: {
    ...fonts.jost400
  }
});
