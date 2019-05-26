import React from 'react';
import { ScrollView, View, Text } from 'react-native';

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
      title: navigation.getParam('tasks').filter(t => t.id === navigation.getParam('currentTask'))[0].name
    };
  };

  render() {
    const tasks = this.props.navigation.getParam('tasks');
    const task = tasks.filter(t => t.id === this.props.navigation.getParam('currentTask'))[0];

    return (
      <ScrollView contentContainerStyle={{ padding: 8 }}>
        <TaskLabels 
          task={task}
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
        <TaskAuthor 
          author={task.student_name || task.teacher_name}
        />
        <TaskDelete 
          task={task}
          onDeleteTask={this.props.navigation.state.params.onDeleteTask}
        />
      </ScrollView>
    );
  }
}
