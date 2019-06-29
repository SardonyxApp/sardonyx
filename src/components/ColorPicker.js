import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

import { fonts, styles, colors } from '../styles';

export default class ColorPicker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      focused: false,
      error: false,
      colors: [] // Color palette
    }
  }

  componentDidMount() {
    this.setState(prevState => {
      const colors = [];
      for (let i = 0; i < 6; i++) {
        colors.push("#000000".replace(/0/g, () => Math.floor(Math.random() * 16).toString(16))); // Generate random colors for the color palette
        if (i === 5) return { colors }
      }
    });
  }

  _handleChange(color) {
    // When called by onEndEditing, color is an event object
    if (typeof color === 'object') color = color.nativeEvent.text;

    this.setState({
      focused: false
    });

    if (!/^#([\da-fA-F]{3}|[\da-fA-F]{6})$/.test(color)) return this.setState({ error: true });

    this.setState({ 
      error: false 
    });
    this.props.onChangeColor(color);
  }

  render() {
    // The color palette
    const dots = this.state.colors.map(color => {
      return (
        <TouchableOpacity onPress={() => this._handleChange(color)} key={color}>
          <View style={[colorStyles.dot, { backgroundColor: color }]}></View>
        </TouchableOpacity>
      );
    });

    return (
      <View style={colorStyles.container}>
        {dots}
        <TextInput 
          style={[colorStyles.input, { borderBottomColor: this.state.focused ? colors.blue : this.state.error ? colors.error : colors.gray1 }]}
          placeholder="hex color"
          maxLength={7}
          multiline={false}
          defaultValue={this.props.color}
          onFocus={() => this.setState({ focused: true })}
          onEndEditing={color => this._handleChange(color)}
        />
      </View>
    );
  }
}

const colorStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  dot: {
    borderRadius: 2,
    width: 24,
    height: 24,
    margin: 4
  },
  input: {
    ...fonts.jost300,
    fontSize: 18,
    borderBottomWidth: 2,
    marginBottom: 8,
    ...styles.padding5,
    flex: 1,
    marginLeft: 8
  }
})