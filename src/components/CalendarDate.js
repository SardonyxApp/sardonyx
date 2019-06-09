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
    const styles =
      this.props.type === 'mini' ? miniCalendarStyles : calendarStyles;
    return (
      <View style={styles.container}>
        <View style={styles.calendar}>
          <View
            style={[
              styles.month,
              this.props.bgColor && {
                backgroundColor: this.props.bgColor
              }
            ]}
          >
            <Text style={styles.monthText}>
              {this.shortMonthNames[this.props.date.getMonth()]}
            </Text>
          </View>
          <View style={styles.date}>
            <Text
              style={[
                styles.dateText,
                this.props.color && {
                  color: this.props.color
                }
              ]}
            >
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

const miniCalendarStyles = StyleSheet.create({
  container: {
    height: 50,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  calendar: {
    height: 40,
    width: 40,
    borderRadius: 2,
    backgroundColor: colors.white,
    elevation: 1,
    overflow: 'hidden'
  },
  month: {
    height: 14,
    width: 40,
    top: 0,
    backgroundColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center'
  },
  monthText: {
    fontSize: 10,
    color: colors.white,
    textTransform: 'uppercase',
    ...fonts.jost400
  },
  date: {
    height: 26,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  dateText: {
    color: colors.blue,
    fontSize: 22,
    ...fonts.jost500
  }
});
