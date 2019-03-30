import React from 'react';

import { View, Text, StyleSheet } from 'react-native';

import { colors } from '../styles';

export default class ExperienceUneditableWarning extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return this.props.status === 'complete' ? (
      <View style={warningStyles.container}>
        <Text style={warningStyles.text}>
          This experience has been marked as complete and cannot be edited further.
        </Text>
      </View>
    ) : null;
  }
}

const warningStyles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.lightBlue,
    marginBottom: 16
  },
  text: {
    textAlign: 'center',
    color: colors.blue
  }
});
