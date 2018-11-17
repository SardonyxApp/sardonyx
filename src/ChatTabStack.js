import React from 'react';

import { createStackNavigator } from 'react-navigation';

import {
  Icon
} from 'react-native-elements';

import ChatScreen from './screens/ChatScreen';

// Navigation stack for the Home tab.
const ChatTabStack = createStackNavigator(
  {
    Chat: ChatScreen
  },
  {
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#2977b6'
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'normal'
      }
    }
  }
  /*
  , {
    navigationOptions: {}
    Putting tabBarLabel here means applying the label to every child inside the Navigator,
    and not to the Navigator itself. We want to set the name and icon of the tab, so the options
    have to be applied to the Navigator directly after we define it.
  }
  */
);

ChatTabStack.navigationOptions = {
  tabBarLabel: 'Chat',
  tabBarIcon: ({ tintColor }) => (
    <Icon name="chat" color={tintColor} /> 
  ),
  tabBarColor: '#fff'
};

export default ChatTabStack;