import React from 'react';

import { FlatList } from 'react-native';

import { List, TouchableRipple } from 'react-native-paper';
import ExpandableCard from './ExpandableCard';
import { colors } from '../styles';

export default class UpcomingExpandableCard extends ExpandableCard {
  constructor(props) {
    super(props);
    this.state = {
      expanded: true
    };
    this._getGroupClassName = this._getGroupClassName.bind(this);
    this._navigateToUpcomingEventScreen = this._navigateToUpcomingEventScreen.bind(this);
  }

  /**
   * Calculates the time difference from now to the due date and returns it in a legible manner.
   * @param {Date} dueDate
   * @param {Date} now
   */
  _calculateTimeTo(dueDate, now) {
    let difference = dueDate - now;
    if (difference < 60 * 60 * 1000) {
      return Math.round(difference / (60 * 1000)) + ' minute(s)';
    } else if (difference < 24 * 60 * 60 * 1000) {
      return Math.round(difference / (60 * 60 * 1000)) + ' hour(s)';
    } else if (difference < 30 * 24 * 60 * 60 * 1000) {
      return Math.round(difference / (24 * 60 * 60 * 1000)) + ' day(s)';
    } 
    return Math.round(difference / (30 * 24 * 60 * 60 * 1000)) + ' month(s)';
  }

  /**
   * Get the name of the class or group that the event is located in.
   * @param {String} link
   */
  _getGroupClassName(link) {
    let groupClass = this.props.allGroupsAndClasses.find(item => {
      return link.includes(item.link.slice(0, -9)); // Remove the /overview bit
    });
    return groupClass ? decodeURI(groupClass.title) : 'IB Manager';
  }

  _navigateToUpcomingEventScreen(item) {
    this.props.navigation.navigate('UpcomingEventItem', {
      ...item,
      title: decodeURI(item.title),
      groupClassName: this._getGroupClassName(item.link)
    });
  }

  /**
   * Returns a red color in object form if the due date is within a day. Otherwise remove the
   * color parameter altogether from List.Icon.
   * @param {String} due 
   */
  _iconColor(due) {
    if (Date.parse(due) - Date.now() < 24 * 60 * 60 * 1000) return { color: colors.error};
    return {};
  }

  _renderList() {
    return (
      <FlatList
        data={this.props.upcomingEvents}
        keyExtractor={item => item.link}
        renderItem={({ item }) => (
          <TouchableRipple
            onPress={() => this._navigateToUpcomingEventScreen(item)}
            rippleColor="rgba(0, 0, 0, .16)"
          >
            <List.Item
              left={props => <List.Icon {...props} icon="event" {...this._iconColor(item.due)}/>}
              title={decodeURI(item.title)}
              description={
                'due in ' +
                this._calculateTimeTo(Date.parse(item.due), Date.now()) +
                ' • ' +
                this._getGroupClassName(item.link)
              }
            />
          </TouchableRipple>
        )}
      />
    );
  }
}
