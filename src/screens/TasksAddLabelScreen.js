import React from 'react';
import { ScrollView, Text, TextInput, StyleSheet } from 'react-native';
import { fonts, styles } from '../styles';

export default class TasksAddLabelScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Create new label'
    };
  };

  render() {
    return (
      <ScrollView>
        <Text>New label</Text>
        <TextInput 
          maxlength={255}
          multiline={false}
        />
      </ScrollView>
    );
  }
}