import React from 'react';
import { Text } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';

import TasksScreen from './screens/TasksScreen';
import TasksInfoScreen from './screens/TasksInfoScreen';
import TasksCreateScreen from './screens/TasksCreateScreen';
import TasksLabelsSelectorScreen from './screens/TasksLabelsSelectorScreen';
import TasksManageLabelsScreen from './screens/TasksManageLabelsScreen';
import TasksAddTaskScreen from './screens/TasksAddTaskScreen';
import TasksUpdateLabelScreen from './screens/TasksUpdateLabelScreen';

import { colors, fonts } from './styles';

// Navigation stack for the tasks tab
const TasksStack = createStackNavigator(
  {
    Tasks: TasksScreen, // Main screen: list of tasks
    TaskInfo: TasksInfoScreen, // Detailed information for one task
    TasksCreate: TasksCreateScreen, // Screen with tasklist actions
    LabelsSelector: TasksLabelsSelectorScreen, // Choose labels for a task
    ManageLabels: TasksManageLabelsScreen, // Display all of the task's labels
    AddTask: TasksAddTaskScreen, // Create a new task
    UpdateLabel: TasksUpdateLabelScreen // Create or edit a new label
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
