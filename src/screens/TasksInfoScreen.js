import React from 'react';
import { ScrollView, View, Text } from 'react-native';

import TaskTitle from '../components/TaskTitle';
import TaskLabel from '../components/TaskLabel';
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
      title: 'Task information'
    };
  };

  render() {
    const tasks = this.props.navigation.getParam('tasks');
    const task = tasks.filter(t => t.id === this.props.navigation.getParam('currentTask'))[0];

    return (
      <ScrollView>
        <TaskTitle 
          id={task.id}
          title={task.name}
          onUpdateTask={this.props.navigation.state.params.onUpdateTask}
        />
        <View>
          {/* <TaskLabels 
            task={task}
            onModal={this.props.onModal}
          /> */}
          <TaskDescription
            id={task.id}
            description={task.description}
            onUpdateTask={this.props.navigation.state.params.onUpdateTask}
          />
          <TaskDue 
            id={task.id}
            due={task.due}
            onModal={this.props.onModal}
            onUpdateTask={this.props.navigation.state.params.onUpdateTask}
          />
          <TaskAuthor 
            author={task.student_name || task.teacher_name}
          />
          <TaskDelete 
            task={task}
            onDeleteTask={this.props.navigation.state.params.onDeleteTask}
          />
        </View>
      </ScrollView>
    );
  }
}
