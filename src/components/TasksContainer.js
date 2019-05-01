import React from 'react';
import { View, Text } from 'react-native';

import TaskListCard from './TaskListCard';

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
      <View>
        <View className="side">
          <Text>{i === 0 ? new Date(t.due).toLocaleString('en-US', { weekday: 'short' }) : null}</Text>
          <Text>{i === 0 ? new Date(t.due).getDate() : null}</Text>
        </View>
        <TaskListCard 
          task={t}
          selected={this.props.currentTask === t.id}
          onSelectTask={this.props.onSelectTask}
        />
      </View>
    ));
    count += todayTasks.length;

    const upcomingTasks = tasks.filter(t => new Date().toDateString() !== new Date(t.due).toDateString() && new Date() < new Date(t.due)).map(t => {
      const due = new Date(t.due);
      const view = (
        <View>
          <View className="side">
            <Text>{store === due.toDateString() ? null : due.toLocaleString('en-US', { weekday: 'short' })}</Text>
            <Text>{store === due.toDateString() ? null : due.getDate()}</Text>
          </View>
          <TaskListCard 
            task={t}
            selected={this.props.currentTask === t.id}
            onSelectTask={this.props.onSelectTask}
          />
        </View>
      );
      store = due.toDateString();
      return view;
    });
    count += upcomingTasks.length;

    const noDateTasks = tasks.filter(t => t.due === null).map(t => (
      <View>
        <View className="side"></View>
        <TaskListCard 
          task={t}
          selected={this.props.currentTask === t.id}
          onSelectTask={this.props.onSelectTask}
        />
      </View>
    ));
    count += noDateTasks.length;

    const pastTasks = tasks.filter(t => t.due !== null && new Date().toDateString() !== new Date(t.due).toDateString() && new Date() > new Date(t.due)).reverse().map(t => {
      const due = new Date(t.due);
      const view = (
        <View>
          <View className="side">
            <Text>{store === due.toDateString() ? null : due.toLocaleString('en-US', { month: 'short' })}</Text>
            <Text>{store === due.toDateString() ? null : due.getDate()}</Text>
          </View>
          <TaskListCard 
            task={t}
            selected={this.props.currentTask === t.id}
            onSelectTask={this.props.onSelectTask}
          />
        </View>
      );
      store = due.toDateString();
      return view;
    });

    return (
      <View>
        <Text 
          className="subheading" 
          // style={{ display: todayTasks.length ? 'block' : 'none' }}
        >
          Today
        </Text>
        {todayTasks}
        <Text 
          className="subheading" 
          // style={{ display: upcomingTasks.length ? 'block' : 'none', marginTop: todayTasks.length ? '16px' : 0 }}
        >
          Upcoming
        </Text>
        {upcomingTasks}
        <Text 
          className="subheading" 
          // style={{ display: noDateTasks.length ? 'block' : 'none', marginTop: todayTasks.length || upcomingTasks.length ? '16px' : 0 }}
        >
          No date set
        </Text>
        {noDateTasks}
        <Text 
          className="subheading" 
          // style={{ display: pastTasks.length ? 'block' : 'none', marginTop: todayTasks.length || upcomingTasks.length || noDateTasks.length ? '16px' : 0 }}
        >
          Past due
        </Text>
        {pastTasks}
        <Text 
          className="subheading" 
          // style={{ display: tasks.length ? 'none' : 'block' }}
        >
          No tasks found
        </Text>
      </View>
    );
  }
}