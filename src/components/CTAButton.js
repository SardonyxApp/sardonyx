import React from 'react';

import { View, Text, StyleSheet } from 'react-native';

import { TouchableRipple } from 'react-native-paper';

import { fonts, colors, elevations } from '../styles';

export default class CTAButton extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={[buttonStyles.container, this.props.style]}>
        <View style={buttonStyles.buttonOuter}>
          <TouchableRipple onPress={this.props.onPress}>
            <View style={buttonStyles.button}>
              <Text style={buttonStyles.text}>{this.props.children}</Text>
            </View>
          </TouchableRipple>
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
    ...elevations.ten,
    backgroundColor: colors.primary
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10
  },
  text: {
    color: 'white',
    fontSize: 16,
    ...fonts.jost300
  }
});
