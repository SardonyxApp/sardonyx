import React from 'react';

import { Text, StyleSheet } from 'react-native';

import { colors, fonts } from '../styles';

export default class OverviewHeading extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return <Text style={[headingStyles.title, this.props.style]}>{this.props.children}</Text>;
  }
}

const headingStyles = StyleSheet.create({
  title: {
    ...fonts.jost500,
    fontSize: 28,
    color: colors.darkPrimary2,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: -16
  }
});
