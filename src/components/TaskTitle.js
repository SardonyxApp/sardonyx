import React from 'react';
import { View, Text, TextInput, TouchableWithoutFeedback, StyleSheet, Platform } from 'react-native';

import { fonts, colors } from '../styles';

export default class TaskTitle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      focused: false,
      title: null
    };

    this._handleSubmit = this._handleSubmit.bind(this);
  }

  componentDidMount() {
    this.setState({
      title: this.props.title
    });
  }

  _handleSubmit() {
    this.setState({
      focused: false
    });

    this.props.onUpdateTask({ 
      id: this.props.id, 
      name: this.state.title 
    });
  }

  render() {
    return this.state.focused ? (
      <View
        style={titleStyles.inputContainer}
      >
        <TextInput 
          style={titleStyles.text}
          multiline={false}
          onBlur={this._handleSubmit}
          onChangeText={text => this.setState({ title: text })}
          maxLength={255}
          value={this.state.title}
          autoFocus={true}
        />
      </View>
    ) : (
      <View style={titleStyles.textContainer}>
        <TouchableWithoutFeedback 
          onPress={() => this.setState({ focused: true })} 
        >
          <Text 
            style={[titleStyles.text, { marginRight: 8 }]}
            numberOfLines={1}
            ellipsizeMode={'tail'}
          >
            {this.state.title}
          </Text>
        </TouchableWithoutFeedback>
      </View>
      
    )
  }
}

const titleStyles = StyleSheet.create({
  inputContainer: {
    borderBottomWidth: 2,
    borderBottomColor: colors.blue,
    flex: 1,
    marginRight: 8,
    marginLeft: Platform.OS === 'ios' ? 24 : 0
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
    marginLeft: Platform.OS === 'ios' ? 24 : 0
  }, 
  text: {
    ...fonts.jost400,
    color: 'white',
    fontSize: 18
  }
});