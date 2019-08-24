import React from 'react';
import { Text } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';

import TasksScreen from './screens/TasksScreen';
import TasksInfoScreen from './screens/TasksInfoScreen';
import TasksManageScreen from './screens/TasksManageScreen';
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
    TasksManage: TasksManageScreen, // Screen with tasklist actions
    LabelsSelector: TasksLabelsSelectorScreen, // Choose labels for a task
    ManageLabels: TasksManageLabelsScreen, // Display all of the task's labels
    AddTask: TasksAddTaskScreen, // Create a new task
    UpdateLabel: TasksUpdateLabelScreen // Create or edit a new label
  },
  {
    initialRouteName: 'Tasks',
    navigationOptions: {
      tabBarLabel: <Text style={fonts.jost400}>Tasks</Text>,
      tabBarIcon: ({ focused, tintColor }) => <Icon type="material-community" name={focused ? 'view-dashboard' : 'view-dashboard-outline'} color={tintColor} />
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
