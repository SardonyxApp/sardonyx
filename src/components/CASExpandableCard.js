import React from 'react';

import { FlatList } from 'react-native';

import { BASE_URL } from 'react-native-dotenv';

import { Storage } from '../helpers';
import { List, TouchableRipple } from 'react-native-paper';
import ExpandableCard from './ExpandableCard';

export default class CASExpandableCard extends ExpandableCard {
  constructor(props) {
    super(props);
    this.state = {
      casExperiences: []
    }
    this._navigateToCASScreen = this._navigateToCASScreen.bind(this);
  }

  componentDidMount() {
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
            casExperiences: JSON.parse(response.headers.map['managebac-data'])
          });
          return;
        }
      });
    });
  }

  _getIconName(status) {
    switch(status) {
      case 'complete':
        return 'check';
      case 'approved':
        return 'thumb-up';
      case 'rejected':
        return 'cancel';
      case 'needs approval':
        return 'clock-outline';
      default:
        return 'help-circle';
    }
  }

  _navigateToCASScreen(link, title) {
    this.props.navigation.navigate('CASItem', {
      apiLink: link,
      title
    });
  }

  _renderList() {
    return (
      <FlatList
        data={this.state.casExperiences.cas}
        keyExtractor={(item) => item.link}
        renderItem={({item}) => (
          <TouchableRipple 
            onPress={() => this._navigateToCASScreen(item.link, decodeURI(item.title))}
            rippleColor="rgba(0, 0, 0, .16)">
            <List.Item
              left={props => <List.Icon {...props} icon={this._getIconName(item.status)} />}
              title={decodeURI(item.title)}
              description={item.reflectionCount + (item.project ? ' • PROJECT' : '')}/>
          </TouchableRipple>
        )} />
    );
  }
}