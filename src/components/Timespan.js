import React from 'react';

import { View, Text, StyleSheet } from 'react-native';

import { fonts, colors } from '../styles';
import CalendarDate from './CalendarDate';

export default class Timespan extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    if (!this.props.timespan) return null;
    const start = this.props.timespan.split(' - ')[0];
    const startDate = new Date(Date.parse(start));
    const end = this.props.timespan.split(' - ')[1];
    const endDate = new Date(Date.parse(end));
    return (
      <View style={timespanStyles.container}>
        <CalendarDate mini={true} date={startDate} />
        <View style={timespanStyles.barContainer}>
          <View style={timespanStyles.bar} />
        </View>
        <CalendarDate mini={true} date={endDate} />
      </View>
    );
  }
}

const timespanStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  barContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  bar: {
    height: 6,
    flex: 1,
    backgroundColor: colors.gray2
  }
});
