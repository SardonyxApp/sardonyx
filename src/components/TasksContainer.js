import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';

import TaskListCard from './TaskListCard';
import OverviewHeading from './OverviewHeading';
import CalendarDate from './CalendarDate';
import { fonts, colors, styles } from '../styles';

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
            <CalendarDate type="mini" date={new Date(t.due)} bgColor={colors.primary} color={colors.primary} />
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
              <CalendarDate type="mini" date={due} bgColor={colors.primary} color={colors.primary} />
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
          <View style={containerStyles.side} />
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
              <CalendarDate type="mini" date={due} bgColor={colors.primary} color={colors.primary}/>
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
        {todayTasks.length ? <OverviewHeading style={containerStyles.heading}>Today</OverviewHeading> : null}
        {todayTasks}

        {upcomingTasks.length ? (
          <OverviewHeading style={containerStyles.heading}>Upcoming</OverviewHeading>
        ) : null}
        {upcomingTasks}

        {noDateTasks.length ? (
          <OverviewHeading style={containerStyles.heading}>No Date Set</OverviewHeading>
        ) : null}
        {noDateTasks}

        {pastTasks.length ? <OverviewHeading style={containerStyles.heading}>Past Due</OverviewHeading> : null}
        {pastTasks}

        {tasks.length ? null : <Text style={containerStyles.subheading}>NO TASKS FOUND</Text>}
        
        {this.props.displayPastTasks 
          ? null 
          : <Button 
              onPress={this.props.onLoadAll} 
              title="Load more tasks" 
              type="solid"
              buttonStyle={{ backgroundColor: colors.primary, borderRadius: 1000 }}
              containerStyle={styles.padding20}
              titleStyle={fonts.jost400}
            />
          }
      </View>
    );
  }
}

const containerStyles = StyleSheet.create({
  heading: {
    marginTop: 32,
    marginBottom: 0 // override default -16
  },
  subheading: {
    ...fonts.jost400,
    fontSize: 16,
    paddingHorizontal: 16
  },
  container: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: 12,
    paddingHorizontal: 16,
  },
  touchableOpacity: {
    flex: 1
  },
  side: {
    width: 25,
    justifyContent: 'center',
    zIndex: 1
  }
});
