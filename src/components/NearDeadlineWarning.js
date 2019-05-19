import React from 'react';

import { View, Text, StyleSheet } from 'react-native';

import { colors } from '../styles';

export default class NearDeadlineWarning extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  /**
   * Calculates the time difference from now to the due date and returns it in a legible manner.
   * @param {Date} dueDate
   * @param {Date} now
   * @return {Boolean}
   */
  _isWithinNextDay(dueDate, now) {
    let difference = dueDate - now;
    if (difference <= 24 * 60 * 60 * 1000) return true;
    return false;
  }

  /**
   * Calls this._isWithinNextDay, to return a boolean of whether to render the warning or not.
   * @param {Date} dueDate
   * @return {Boolean}
   */
  _decideToRender(dueDate) {
    return this._isWithinNextDay(dueDate, Date.now());
  }

  render() {
    return this._decideToRender(this.props.date) ? (
      <View style={warningStyles.container}>
        <Text style={warningStyles.text}>
          The deadline for this task is in less than a day!
        </Text>
      </View>
    ) : null;
  }
}

const warningStyles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.lightError2,
    marginBottom: 16
  },
  text: {
    textAlign: 'center',
    color: colors.error
  }
});
