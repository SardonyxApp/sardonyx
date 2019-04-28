import React from 'react';

import { View, StyleSheet, Dimensions, Text } from 'react-native';
import { colors, fonts } from '../styles';

export default class GreetingsCard extends React.Component {

  constructor(props) {
    super(props);
  }

  _getFirstName(text) {
    if(typeof text === 'string') return text.split(' ')[0];
    return text;
  }

  render() {
    return (
      <View style={greetingsCardStyles.container}>
        <Text style={greetingsCardStyles.title} numberOfLines={1}>Hello <Text style={greetingsCardStyles.name}>{this._getFirstName(this.props.name)}</Text></Text>
      </View>
    )
  }
}

const greetingsCardStyles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    height: 200,
    backgroundColor: colors.blue,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    ...fonts.jost200,
    fontSize: 40,
    color: colors.white
  },
  name: {
    ...fonts.jost500
  }
})