import React from 'react';
import { ScrollView } from 'react-native';

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
    const id = navigation.getParam('currentTask');
    return {
      headerTitle: <TaskTitle id={id} title={navigation.getParam('tasks').filter(t => t.id === id)[0].name} onUpdateTask={navigation.state.params.onUpdateTask} />
    };
  };

  render() {
    const tasks = this.props.navigation.getParam('tasks');
    const task = tasks.filter(t => t.id === this.props.navigation.getParam('currentTask'))[0];

    return (
      <ScrollView contentContainerStyle={{ padding: 8, marginBottom: 100 }}>
        <TaskLabels 
          task={task}
          navigation={this.props.navigation}
          subjects={this.props.navigation.getParam('subjects')}
          categories={this.props.navigation.getParam('categories')}
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
        <TaskAuthor 
          author={task.student_name || task.teacher_name}
        />
        <TaskDelete 
          id={task.id}
          navigation={this.props.navigation}
          onDeleteTask={this.props.navigation.state.params.onDeleteTask}
        />
      </ScrollView>
    );
  }
}
