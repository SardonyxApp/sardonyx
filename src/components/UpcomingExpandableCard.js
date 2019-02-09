import React from 'react';

import { FlatList } from 'react-native';

import { List } from 'react-native-paper';
import { fonts } from '../styles';

import ExpandableCard from './ExpandableCard';

export default class UpcomingExpandableCard extends ExpandableCard {
  constructor(props) {
    super(props);
    this._getGroupClassName = this._getGroupClassName.bind(this);
  }

  /**
   * Calculates the time difference from now to the due date and returns it in a legible manner.
   * @param {Date} dueDate 
   * @param {Date} now 
   */
  _calculateTimeTo(dueDate, now) {
    let difference = dueDate - now;
    if(difference < 60*60*1000) {
      return Math.round(difference/(60*1000)) + ' minute(s)';
    } else if(difference < 24*60*60*1000) {
      return Math.round(difference/(60*60*1000)) + ' hour(s)';
    } else if(difference < 30*24*60*60*1000) {
      return Math.round(difference/(24*60*60*1000)) + ' day(s)';
    }
  }

  /**
   * Get the name of the class or group that the event is located in.
   * @param {String} link 
   */
  _getGroupClassName(link) {
    console.log(link);
    let groupClass = this.props.allGroupsAndClasses.find(item => {
      return link.includes(item.link.slice(0, -9)); // Remove the /overview bit
    });
    return groupClass ? decodeURI(groupClass.title) : 'IB Manager';
  }

  _renderList() {
    return (
      <FlatList
        data={this.props.upcomingEvents}
        keyExtractor={(item) => item.link}
        renderItem={({item}) => (
          <List.Item 
            left={props => <List.Icon {...props} icon="event"/>}
            title={decodeURI(item.title)}
            description={'due in ' + this._calculateTimeTo(Date.parse(item.due), Date.now()) + ' • ' + this._getGroupClassName(item.link)}
            style={fonts.jost400}/>
        )}/>
    );
  }
}