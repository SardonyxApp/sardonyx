import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';

import { styles, fonts } from '../styles';

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
    return (
      <View
        style={{ borderBottomWidth: this.state.focused ? 2 : 0, borderBottomColor: '#2977b6', flex: 1, marginHorizontal: 8 }}
      >
        <TextInput 
          style={titleStyles.text}
          multiline={false}
          onFocus={() => this.setState({ focused: true })}
          onBlur={this._handleSubmit}
          onChangeText={text => this.setState({ title: text })}
          maxLength={255}
          value={this.state.title}
        />
      </View>
    );
  }
}

const titleStyles = StyleSheet.create({
  text: {
    ...fonts.jost400,
    color: 'white',
    fontSize: 18
  }
});