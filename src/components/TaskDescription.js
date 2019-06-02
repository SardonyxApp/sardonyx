import React from 'react';
import { View, Text, TextInput, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';

import { styles, fonts, colors } from '../styles';

// The editable description of a task
export default class TaskDescription extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      focused: false,
      height: 0, // Contrls the height of the TextInput
      description: null
    };

    this._handleFocus = this._handleFocus.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
  }

  componentDidMount() {
    this.setState({
      description: this.props.description
    });
  }

  _handleFocus() {
    this.setState({
      focused: true
    });
  }

  _handleSubmit() {
    this.setState({
      focused: false
    });

    this.props.onUpdateTask({
      id: this.props.id, 
      description: this.state.description
    });
  }

  render() {
    return (
      <View style={descriptionStyles.container}>
        <Icon 
          name="subject" // Using this iconbecause the "notes" icon somehow does not load
          type="material"
          iconStyles={styles.icon}
        />
        {!this.state.focused 
          ? <TouchableWithoutFeedback 
              onPress={this._handleFocus} 
              style={{ flex: 1 }}
            >
              <Text style={descriptionStyles.text}>
                {this.state.description ? this.state.description : 'No description provided.'}
              </Text>
            </TouchableWithoutFeedback>
          : <View style={{ flex: 1, flexDirection: 'row' }}>
              <TextInput
                style={[descriptionStyles.text, { borderBottomWidth: 2, borderBottomColor: colors.blue }]}
                multiline={true}
                autoFocus={true}
                scrollEnabled={false}
                onBlur={this._handleSubmit}
                onChangeText={text => this.setState({ description: text })}
                onContentSizeChange={event => this.setState({ height: event.nativeEvent.contentSize.height })}
                height={this.state.height}
                maxLength={65535}
                value={this.state.description}
              />
            </View>
        }
      </View>
    );
  }
}

const descriptionStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8
  },
  text: {
    ...fonts.jost300,
    fontSize: 16,
    paddingHorizontal: 8,
    flex: 1
  }
});