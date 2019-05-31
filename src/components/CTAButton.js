import React from 'react';

import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';

import { fonts, colors } from '../styles';

export default class CTAButton extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={[buttonStyles.container, this.props.style]}>
        <View style={buttonStyles.buttonOuter}>
          <TouchableHighlight onPress={this.props.onPress}>
            <View style={buttonStyles.button}>
              <Text style={buttonStyles.text}>{this.props.children}</Text>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

const buttonStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonOuter: {
    overflow: 'hidden',
    borderRadius: 30,
    elevation: 3
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.primary,
  },
  text: {
    color: 'white',
    fontSize: 16,
    ...fonts.jost300
  }
});
