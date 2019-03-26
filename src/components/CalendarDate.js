import React from 'react';

import { View, Text, StyleSheet } from 'react-native';

import { fonts, colors } from '../styles';

export default class CalendarDate extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  shortMonthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ];

  render() {
    return (
      <View style={calendarStyles.container}>
        <View style={calendarStyles.calendar}>
          <View style={calendarStyles.month}>
            <Text style={calendarStyles.monthText}>
              {this.shortMonthNames[this.props.date.getMonth()]}
            </Text>
          </View>
          <View style={calendarStyles.date}>
            <Text style={calendarStyles.dateText}>
              {this.props.date.getDate()}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

const calendarStyles = StyleSheet.create({
  container: {
    height: 100,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center'
  },
  calendar: {
    height: 72,
    width: 72,
    borderRadius: 3,
    backgroundColor: colors.white,
    elevation: 2,
    overflow: 'hidden'
  },
  month: {
    height: 20,
    width: 72,
    top: 0,
    backgroundColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center'
  },
  monthText: {
    color: colors.white,
    textTransform: 'uppercase',
    ...fonts.jost400
  },
  date: {
    height: 52,
    width: 72,
    alignItems: 'center',
    justifyContent: 'center'
  },
  dateText: {
    color: colors.blue,
    fontSize: 32,
    ...fonts.jost500
  }
});
