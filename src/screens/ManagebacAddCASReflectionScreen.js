import React from 'react';

import { View, TextInput } from 'react-native';

export default class ManagebacAddCASReflectionScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reflectionValue: ''
    }
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Write New Reflection'
    };
  };

  render() {
    return (
      <View>
        <TextInput
          value={this.state.reflectionValue}
          returnKeyType="next"
          autoCapitalize="sentences"
          onChangeText={text =>
            this.setState({
              reflectionValue: text
            })
          }
          blurOnSubmit={false}
        />
      </View>
    );
  }
}
