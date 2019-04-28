import React from 'react';

import { FlatList, Alert } from 'react-native';

import { BASE_URL } from '../../env';

import { Storage } from '../helpers';
import { List, TouchableRipple } from 'react-native-paper';
import ExpandableCard from './ExpandableCard';

export default class CASExpandableCard extends ExpandableCard {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      casExperiences: []
    };
    this._navigateToCASScreen = this._navigateToCASScreen.bind(this);
  }

  componentDidMount() {
    _isMounted = true;

    Storage.retrieveCredentials()
      .then(credentials => {
        fetch(BASE_URL + '/api/cas', {
          method: 'GET',
          headers: {
            'Login-Token': credentials
          },
          mode: 'no-cors'
        })
          .then(response => {
            if(!_isMounted) return;
            if (response.status === 200) {
              this.setState({
                casExperiences: JSON.parse(
                  response.headers.map['managebac-data']
                )
              });
              return;
            }
          })
          .catch(error => {
            console.warn(error);
            return;
          });
      })
      .catch(err => {
        console.warn(err);
      });
  }

  componentWillUnmount() {
    _isMounted = false;
  }

  /**
   * Returns MaterialIcons icon names depending on experience status.
   * @param {String} status
   */
  _getIconName(status) {
    switch (status) {
      case 'complete':
        return 'check';
      case 'approved':
        return 'thumb-up';
      case 'rejected':
        return 'cancel';
      case 'needs_approval':
        return 'access-time';
      default:
        return 'help-outline';
    }
  }

  /**
   * Returns hex color codes for icons depending on experience status. These are taken from
   * the SVG data on the CAS list page.
   * Returns an object instead of a string because there cannot be an empty string for the
   * 'default' color - and we have to get rid of the color key entirely.
   * @param {String} status
   * @return {Object}
   */
  _getIconColor(status) {
    switch (status) {
      case 'complete':
        return { color: '#1ECD6E' };
      case 'approved':
        return { color: '#478CFE' };
      case 'rejected':
        return { color: '#e94b35' };
      case 'needs_approval':
        return { color: '#f59d00' };
      default:
        return {};
    }
  }

  _navigateToCASScreen(link, reflectionCount, title) {
    this.props.navigation.navigate('CASItem', {
      apiLink: link,
      reflectionCount,
      title
    });
  }

  _renderList() {
    return (
      <FlatList
        data={this.state.casExperiences.cas}
        keyExtractor={item => item.link}
        renderItem={({ item }) => (
          <TouchableRipple
            onPress={() =>
              this._navigateToCASScreen(
                item.link,
                item.reflectionCount, 
                decodeURI(item.title)
              )
            }
            rippleColor="rgba(0, 0, 0, .16)"
          >
            <List.Item
              left={props => (
                <List.Icon
                  {...props}
                  icon={this._getIconName(item.status)}
                  {...this._getIconColor(item.status)}
                />
              )}
              title={decodeURI(item.title)}
              description={
                (item.reflectionCount
                  ? item.reflectionCount
                  : '0 reflections') + (item.project ? ' • PROJECT' : '')
              }
            />
          </TouchableRipple>
        )}
      />
    );
  }
}
