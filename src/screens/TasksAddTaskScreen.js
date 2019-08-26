import React from 'react';
import { ScrollView, Text, TextInput, StyleSheet, Platform } from 'react-native';
import { Button, Icon } from 'react-native-elements';

import { fonts, styles, colors } from '../styles';
import HeaderIcon from '../components/HeaderIcon';

export default class TasksAddTaskScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      focused: true,
      name: ''
    };

    this._handlePress = this._handlePress.bind(this);
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Create new task',
      headerRight: (
        <HeaderIcon
          onPress={() =>
            navigation.navigate('TasksManage', navigation.state.params)
          }
        >
          <Icon
            name={Platform.OS === 'android' ? 'more-vert' : 'more-horiz'}
            type="material"
            color="white"
          />
        </HeaderIcon>
      )
    };
  };

  _handlePress() {
    if (!this.state.name) return;
    this.props.navigation.state.params.onCreateTask({ name: this.state.name });
  }

  render() {
    return (
      <ScrollView style={addStyles.container}>
        <Text style={addStyles.heading}>Please enter the name of the task</Text>
        <TextInput
          style={[
            addStyles.input,
            {
              borderBottomColor: this.state.focused ? colors.blue : colors.gray1
            }
          ]}
          maxLength={255}
          multiline={false}
          autoFocus={true}
          value={this.state.name}
          onChangeText={text => this.setState({ name: text })}
          onFocus={() => this.setState({ focused: true })}
          onBlur={() => this.setState({ focused: false })}
          onSubmitEditing={this._handlePress}
          returnKeyType="go"
        />
        <Button
          title="Create task"
          type="solid"
          buttonStyle={{ backgroundColor: colors.primary, borderRadius: 1000 }}
          containerStyle={styles.padding10}
          titleStyle={fonts.jost300}
          onPress={this._handlePress}
        />
      </ScrollView>
    );
  }
}

const addStyles = StyleSheet.create({
  container: {
    padding: 8,
    backgroundColor: colors.lightBackground
  },
  heading: {
    ...fonts.jost300,
    fontSize: 18,
    marginVertical: 4
  },
  input: {
    ...fonts.jost400,
    fontSize: 18,
    borderBottomWidth: 2,
    marginBottom: 8,
    ...styles.padding5
  }
});
