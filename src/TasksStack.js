import React from 'react';

import { Text } from 'react-native';

import { createStackNavigator } from 'react-navigation';

import { Icon } from 'react-native-elements';

import TasksScreen from './screens/TasksScreen';
import TasksInfoScreen from './screens/TasksInfoScreen';
import TasksLabelsFilterScreen from './screens/TasksLabelsFilterScreen'
import TaskLabelsSelectorScreen from './screens/TaskLabelsSelectorScreen';

import { colors, fonts } from './styles';

// Navigation stack for the Chat tab
const TasksStack = createStackNavigator(
  {
    Tasks: TasksScreen,
    TaskInfo: TasksInfoScreen,
    LabelsFilter: TasksLabelsFilterScreen,
    LabelsSelector: TaskLabelsSelectorScreen
  },
  {
    initialRouteName: 'Tasks',
    navigationOptions: {
      tabBarLabel: <Text style={fonts.jost400}>Tasks</Text>,
      tabBarIcon: ({ tintColor }) => <Icon name="dashboard" color={tintColor} />
    },
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: colors.primary
      },
      headerTintColor: colors.white,
      headerTitleStyle: {
        fontWeight: 'normal',
        ...fonts.jost400
      }
    }
  }
);

export default TasksStack;
