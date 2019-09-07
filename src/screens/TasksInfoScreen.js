import React from 'react';
import { ScrollView, StatusBar, Platform } from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { Header } from 'react-navigation';

import { colors } from '../styles';

import TaskTitle from '../components/TaskTitle';
import TaskLabels from '../components/TaskLabels';
import TaskDescription from '../components/TaskDescription';
import TaskDue from '../components/TaskDue';
import TaskAuthor from '../components/TaskAuthor';
import TaskDelete from '../components/TaskDelete';

export default class TasksInfoScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTintColor: colors.black,
      headerTransparent: true,
      headerStyle: { borderBottomWidth: 0 }
    };
  };

  /**
   * Set the status bar color to white.
   */
  _setStatusBar() {
    StatusBar.setBackgroundColor(colors.lightBackground);
    StatusBar.setBarStyle('dark-content');
  }

  componentDidMount() {
    Platform.OS === 'android' && this.props.navigation.addListener('didFocus', this._setStatusBar);
  }

  render() {
    const tasks = this.props.navigation.getParam('tasks');
    const task = tasks.filter(
      t => t.id === this.props.navigation.getParam('currentTask')
    )[0];
    const id = this.props.navigation.getParam('currentTask');

    return (
      <ScrollView
        contentContainerStyle={{
          flex: 1,
          backgroundColor: colors.lightBackground
        }}
      >
        <ScrollView
          contentContainerStyle={{
            paddingTop: Header.HEIGHT + StatusBar.currentHeight,
            padding: 8
          }}
        >
          <TaskTitle
            id={id}
            title={
              this.props.navigation
                .getParam('tasks')
                .filter(t => t.id === id)[0].name
            }
            onUpdateTask={this.props.navigation.state.params.onUpdateTask}
          />
          <TaskLabels
            task={task}
            navigation={this.props.navigation}
            onUpdateTask={this.props.navigation.state.params.onUpdateTask}
          />
          <TaskDescription
            id={task.id}
            description={task.description}
            onUpdateTask={this.props.navigation.state.params.onUpdateTask}
          />
          <TaskDue
            id={task.id}
            due={task.due}
            onUpdateTask={this.props.navigation.state.params.onUpdateTask}
          />
          <TaskAuthor author={task.student_name || task.teacher_name} />
          <TaskDelete
            id={task.id}
            navigation={this.props.navigation}
            onDeleteTask={this.props.navigation.state.params.onDeleteTask}
          />
        </ScrollView>
        <KeyboardSpacer />
      </ScrollView>
    );
  }
}
