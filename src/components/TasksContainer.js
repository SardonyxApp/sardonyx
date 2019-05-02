import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import TaskListCard from './TaskListCard';

import { fonts } from '../styles';

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

    const todayTasks = tasks.filter(t => new Date().toDateString() === new Date(t.due).toDateString()).map((t, i) => (
      <View style={containerStyles.container} key={t.id}>
        <View style={containerStyles.side} className="side">
          <Text style={fonts.jost200}>{i === 0 ? new Date(t.due).getDayName() : null}</Text>
          <Text style={fonts.jost200}>{i === 0 ? new Date(t.due).getDate() : null}</Text>
        </View>
        <TaskListCard 
          task={t}
          onSelectTask={this.props.onSelectTask}
        />
      </View>
    ));
    count += todayTasks.length;

    const upcomingTasks = tasks.filter(t => new Date().toDateString() !== new Date(t.due).toDateString() && new Date() < new Date(t.due)).map(t => {
      const due = new Date(t.due);
      const view = (
        <View style={containerStyles.container} key={t.id}>
          <View style={containerStyles.side} className="side">
            <Text style={fonts.jost200}>{store === due.toDateString() ? null : due.getDayName()}</Text>
            <Text style={fonts.jost200}>{store === due.toDateString() ? null : due.getDate()}</Text>
          </View>
          <TaskListCard 
            task={t}
            onSelectTask={this.props.onSelectTask}
          />
        </View>
      );
      store = due.toDateString();
      return view;
    });
    count += upcomingTasks.length;

    const noDateTasks = tasks.filter(t => t.due === null).map(t => (
      <View style={containerStyles.container} key={t.id}>
        <View style={containerStyles.side} className="side"></View>
        <TaskListCard 
          task={t}
          onSelectTask={this.props.onSelectTask}
        />
      </View>
    ));
    count += noDateTasks.length;

    const pastTasks = tasks.filter(t => t.due !== null && new Date().toDateString() !== new Date(t.due).toDateString() && new Date() > new Date(t.due)).reverse().map(t => {
      const due = new Date(t.due);
      const view = (
        <View style={containerStyles.container} key={t.id}>
          <View style={containerStyles.side} className="side">
            <Text style={fonts.jost200}>{store === due.toDateString() ? null : due.getMonthName()}</Text>
            <Text style={fonts.jost200}>{store === due.toDateString() ? null : due.getDate()}</Text>
          </View>
          <TaskListCard 
            task={t}
            onSelectTask={this.props.onSelectTask}
          />
        </View>
      );
      store = due.toDateString();
      return view;
    });

    return (
      <View>
        {todayTasks.length ? <Text style={[containerStyles.subheading, { marginTop: 16 }]}>TODAY</Text> : null}
        {todayTasks}

        {upcomingTasks.length 
          ? <Text style={[containerStyles.subheading, { marginTop: 16 }]}>UPCOMING</Text>
          : null }
        {upcomingTasks}

        {noDateTasks.length 
          ? <Text style={[containerStyles.subheading, { marginTop: 16 }]}>NO DATE SET</Text> 
          : null}
        {noDateTasks}

        {pastTasks.length 
          ? <Text style={[containerStyles.subheading, { marginTop: 16 }]}>PAST DUE</Text>
          : null}
        {pastTasks}

        {tasks.length ? null : <Text className="subheading" style={containerStyles.subheading}>NO TASKS FOUND</Text>}
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
  side: {
    width: 31,
    marginTop: 12,
    flex: 0
  }
});