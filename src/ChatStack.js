import React from 'react';

import { createStackNavigator } from 'react-navigation';

import {
  Icon
} from 'react-native-elements';

import ChatScreen from './screens/ChatScreen';

import { colors } from './styles';

// Navigation stack for the Chat tab
const ChatStack = createStackNavigator(
  {
    Chat: ChatScreen
  },
  {
    navigationOptions: {
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

// Applied after definition to prevent it from affecting children
ChatStack.navigationOptions = {
  tabBarLabel: 'Chat',
  tabBarIcon: ({ tintColor }) => (
    <Icon name="chat" color={tintColor} /> 
  ),
  tabBarColor: colors.white
};

export default ChatStack;