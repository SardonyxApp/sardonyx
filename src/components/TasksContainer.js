import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { fonts } from '../styles';

import TaskListCard from './TaskListCard';

Date.prototype.getDayName = function() {
  const index = this.getDay();
  return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index];
};

Date.prototype.getMonthName = function() {
  const index= this.getMonth();
  return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index];
};

export default class TasksContainer extends React.PureComponent {
  render() {
    // Apply filters 
    let tasks = this.props.subjectsFilter.length || this.props.categoriesFilter.length
      ? this.props.tasks.filter(t => this.props.subjectsFilter.includes(t.subject_id) || this.props.categoriesFilter.includes(t.category_id))
      : this.props.tasks;

    // Re-sort by date
    tasks = tasks.sort((a, b) => new Date(a.due).valueOf() - new Date(b.due).valueOf());

    // Count the number of cards 
    let count = 0;

    // Temporarily store values for comparison 
    let store = null;

    const todayTasks = tasks
      .filter(t => new Date().toDateString() === new Date(t.due).toDateString())
      .map((t, i) => (
        <View 
          style={containerStyles.container} 
          key={t.id}
        >
          <View style={containerStyles.side}>
            <Text style={fonts.jost200}>
              {i === 0 ? new Date(t.due).getDayName() : null}
            </Text>
            <Text style={fonts.jost200}>
              {i === 0 ? new Date(t.due).getDate() : null}
            </Text>
          </View>
          <TouchableOpacity
            style={containerStyles.touchableOpacity}
            onPress={() => this.props.navigation.navigate('TaskInfo', { ...this.props, currentTask: t.id })}
          >
            <TaskListCard 
              task={t}
            />
          </TouchableOpacity>
        </View>
      ));
    count += todayTasks.length;

    const upcomingTasks = tasks
      .filter(t => new Date().toDateString() !== new Date(t.due).toDateString() && new Date() < new Date(t.due))
      .map(t => {
        const due = new Date(t.due);
        const view = (
          <View 
            style={containerStyles.container} 
            key={t.id}
          >
            <View style={containerStyles.side}>
              <Text style={fonts.jost200}>
                {store === due.toDateString() ? null : due.getDayName()}
              </Text>
              <Text style={fonts.jost200}>
                {store === due.toDateString() ? null : due.getDate()}
              </Text>
            </View>
            <TouchableOpacity
              style={containerStyles.touchableOpacity}
              onPress={() => this.props.navigation.navigate('TaskInfo', { ...this.props, currentTask: t.id })}
            >
              <TaskListCard 
                task={t}
              />
            </TouchableOpacity>
          </View>
        );
        store = due.toDateString();
        return view;
      });
    count += upcomingTasks.length;

    const noDateTasks = tasks
      .filter(t => t.due === null)
      .map(t => (
        <View 
          style={containerStyles.container} 
          key={t.id}
        >
          <View style={containerStyles.side}></View>
          <TouchableOpacity
            style={containerStyles.touchableOpacity}
            onPress={() => this.props.navigation.navigate('TaskInfo', { ...this.props, currentTask: t.id })}
          >
            <TaskListCard 
              task={t}
            />
          </TouchableOpacity>
        </View>
      ));
    count += noDateTasks.length;

    const pastTasks = tasks
      .filter(t => t.due !== null && new Date().toDateString() !== new Date(t.due).toDateString() && new Date() > new Date(t.due))
      .reverse()
      .map(t => {
        const due = new Date(t.due);
        const view = (
          <View 
            style={containerStyles.container} 
            key={t.id}
          >
            <View style={containerStyles.side}>
              <Text style={fonts.jost200}>
                {store === due.toDateString() ? null : due.getMonthName()}
              </Text>
              <Text style={fonts.jost200}>
                {store === due.toDateString() ? null : due.getDate()}
              </Text>
            </View>
            <TouchableOpacity
              style={containerStyles.touchableOpacity}
              onPress={() => this.props.navigation.navigate('TaskInfo', { ...this.props, currentTask: t.id })}
            >
              <TaskListCard 
                task={t}
              />
            </TouchableOpacity>
          </View>
        );
        store = due.toDateString();
        return view;
    });

    return (
      <View>
        {todayTasks.length ? <Text style={containerStyles.subheading}>TODAY</Text> : null}
        {todayTasks}

        {upcomingTasks.length 
          ? <Text style={containerStyles.subheading}>UPCOMING</Text>
          : null }
        {upcomingTasks}

        {noDateTasks.length 
          ? <Text style={containerStyles.subheading}>NO DATE SET</Text> 
          : null}
        {noDateTasks}

        {pastTasks.length 
          ? <Text style={containerStyles.subheading}>PAST DUE</Text>
          : null}
        {pastTasks}

        {tasks.length ? null : <Text style={containerStyles.subheading}>NO TASKS FOUND</Text>}
      </View>
    );
  }
}

const containerStyles = StyleSheet.create({
  subheading: {
    ...fonts.jost400,
    fontSize: 16,
    marginTop: 16
  },
  container: {
    flexDirection: 'row',
    alignItems: 'stretch'
  },
  touchableOpacity: {
    flex: 1
  },
  side: {
    width: 31,
    marginTop: 12,
    flex: 0
  }
});