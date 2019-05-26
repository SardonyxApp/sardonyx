import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';

import { styles, fonts } from '../styles';

export default class TaskDescription extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      focused: false,
      description: null
    };

    this._handleSubmit = this._handleSubmit.bind(this);
  }

  componentDidMount() {
    this.setState({
      description: this.props.description
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
          name="subject" // using this because the "notes" icon somehow does not load
          type="material"
          iconStyles={styles.icon}
        />
        <TextInput
          style={[descriptionStyles.text, { borderBottomWidth: this.state.focused ? 2 : 0, borderBottomColor: '#2977b6' }]}
          multiline={true}
          onFocus={() => this.setState({ focused: true })}
          onBlur={this._handleSubmit}
          onChangeText={text => this.setState({ description: text })}
          maxLength={65535}
          value={this.state.description}
        />
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