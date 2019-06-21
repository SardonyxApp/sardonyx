import React from 'react';
import { View, Text, TextInput, TouchableWithoutFeedback, Linking, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';

import { styles, fonts, colors } from '../styles';

// The editable description of a task
export default class TaskDescription extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      focused: false,
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
    let description = [];
    if (this.state.description) {
      let arr = this.state.description.split(/(\n|\s)/); // Split using regex while retaining separators: ['text', ' ', 'text', '\n', ... ]
      
      // Insert any links
      arr = arr.map((p, i) => {
        if (p.match(/^https?:\/\/[^\s/$.?#&;][^\s]*$/)) {
          return <Text onPress={() => Linking.openURL(p)} style={{ color: colors.blue }} key={`link-${i}`}>{p}</Text>
        } else return p;
      });

      // Combine text pieces
      arr.forEach(c => {
        // If the last element of description array is string and the current element is string
        if (description.length && typeof description[description.length - 1] === 'string' && typeof c === 'string' ) {
          description[description.length - 1] += c;
        } else {
          description.push(c);
        }
        // The resulting array cannot be joined using Array.prototype.join because the Text component has to be preserved. 
      });

      // Wrap strings with Text tag
      description = description.map((val, i) => typeof val === 'string' ? <Text key={`string-${i}`}>{val}</Text> : val);
    }
    
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
              <Text style={[descriptionStyles.text, { paddingVertical: 8 }]}>
                {this.state.description ? description : 'No description provided.'}
              </Text>
            </TouchableWithoutFeedback>
          : <View style={{ flex: 1, flexDirection: 'row' }}>
              <TextInput
                style={[descriptionStyles.text, { borderBottomWidth: 2, borderBottomColor: colors.blue, paddingVertical: 8 }]}
                multiline={true}
                autoFocus={true}
                scrollEnabled={false}
                onBlur={this._handleSubmit}
                onChangeText={text => this.setState({ description: text })}
                maxLength={65535}
              >
                <Text>{this.state.description}</Text>
              </TextInput>
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
    flex: 1
  }
});