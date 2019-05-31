import React from 'react';

import { View, Text, StyleSheet } from 'react-native';

import { colors } from '../styles';

export default class NearDeadlineWarning extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  /**
   * Calculates the time difference from now to the due date and checks if it is in the next 24 hours.
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
   * Calculates the time difference from now to the due date and checks if it is in the past.
   * @param {Date} dueDate
   * @param {Date} now
   * @return {Boolean}
   */
  _isInPast(dueDate, now) {
    let difference = dueDate - now;
    if (difference < 0) return true;
    return false;
  }

  /**
   * Calls this._isWithinNextDay, to return a boolean of whether to render the warning or not.
   * @param {Date} dueDate
   * @return {Boolean}
   */
  _decideToRender(dueDate) {
    if (!this._isWithinNextDay(dueDate, Date.now())) return 0;
    if (this._isInPast(dueDate, Date.now())) return 2;
    return 1;
  }

  render() {
    const renderCondition = this._decideToRender(this.props.date);
    return renderCondition !== 0 ? (
      <View style={warningStyles.container}>
        <Text style={warningStyles.text}>
          {renderCondition === 1
            ? 'The task/event is in less than a day!'
            : 'This task/event is in the past.'}
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
