import React from 'react';

import { Text } from 'react-native';

import { createStackNavigator } from 'react-navigation';

import { Icon } from 'react-native-elements';

import TasksScreen from './screens/TasksScreen';
import TasksInfoScreen from './screens/TasksInfoScreen';
import TasksCreateScreen from './screens/TasksCreateScreen';
import TasksLabelsFilterScreen from './screens/TasksLabelsFilterScreen'
import TasksLabelsSelectorScreen from './screens/TasksLabelsSelectorScreen';
import TasksManageLabelsScreen from './screens/TasksManageLabelsScreen';
import TasksAddTaskScreen from './screens/TasksAddTaskScreen';
import TasksUpdateLabelScreen from './screens/TasksUpdateLabelScreen';

import { colors, fonts } from './styles';

// Navigation stack for the Chat tab
const TasksStack = createStackNavigator(
  {
    Tasks: TasksScreen,
    TaskInfo: TasksInfoScreen,
    TasksCreate: TasksCreateScreen,
    LabelsFilter: TasksLabelsFilterScreen,
    LabelsSelector: TasksLabelsSelectorScreen,
    ManageLabels: TasksManageLabelsScreen,
    AddTask: TasksAddTaskScreen,
    UpdateLabel: TasksUpdateLabelScreen,
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
