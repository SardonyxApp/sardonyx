import React from 'react';

import { createStackNavigator } from 'react-navigation';

import {
  Icon
} from 'react-native-elements';

import TasksScreen from './screens/TasksScreen';

import { colors } from './styles';

// Navigation stack for the Chat tab
const TasksStack = createStackNavigator(
  {
    Tasks: TasksScreen
  },
  {
    navigationOptions: {
      tabBarLabel: 'Tasks',
      tabBarIcon: ({ tintColor }) => (
        <Icon name="list" color={tintColor} />
      )
    },
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: colors.primary
      },
      headerTintColor: colors.white,
      headerTitleStyle: {
        fontWeight: 'normal'
      }
    }
  }
);

export default TasksStack;