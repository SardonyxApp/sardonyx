import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';

import { styles, fonts } from '../styles';

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
      title: navigation.getParam('tasks').filter(t => t.id === navigation.getParam('currentTask'))[0].name
    };
  };

  render() {
    const tasks = this.props.navigation.getParam('tasks');
    const task = tasks.filter(t => t.id === this.props.navigation.getParam('currentTask'))[0];

    const labels = [];
    if (task.subject_id) {
      labels.push(
        <TaskLabel 
          label={{
            name: task.subject_name, 
            color: task.subject_color
          }}
          key={task.id}
          style={infoStyles.label}
          onUpdate={() => this.props.navigation.navigate('TaskLabels')}
          updatable={true}
        />
      );
    }

    if (task.category_id) {
      labels.push(
        <TaskLabel 
          label={{
            name: task.category_name,
            color: task.category_color
          }}
          key={task.id}
          style={infoStyles.label}
          onUpdate={() => this.props.navigation.navigate('TaskLabels')}
          updatable={true}
        />
      );
    }

    return (
      <ScrollView contentContainerStyle={infoStyles.container}>
        <ScrollView 
          horizontal={true} 
          contentContainerStyle={infoStyles.labelsContainer}
        >
          <Icon 
            name="label"
            type="material"
            iconStyle={styles.icon}
          />
          {!!labels.length 
          ? labels 
          : <Text 
            onPress={() => this.props.navigation.navigate('TaskLabels')}
            style={fonts.jost300}
          >
            No labels set.
          </Text>
        }
        </ScrollView>
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
      </ScrollView>
    );
  }
}

const infoStyles = StyleSheet.create({
  container: {
    padding: 8
  },
  labelsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8
  },
  label: {
    padding: 8
  }
});
