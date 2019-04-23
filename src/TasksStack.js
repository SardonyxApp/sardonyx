import React from 'react';

import { Text } from 'react-native';

import { createStackNavigator } from 'react-navigation';

import { Icon } from 'react-native-elements';

import TasksScreen from './screens/TasksScreen';
import TasklistTaskInfoScreen from './screens/TaslistTaskInfoScreen';

import { colors, fonts } from './styles';

// Navigation stack for the Chat tab
const TasksStack = createStackNavigator(
  {
    Tasks: TasksScreen,
    TaskInfo: TasklistTaskInfoScreen
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
