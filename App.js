import React from 'react';
import {
  createSwitchNavigator,
  createStackNavigator,
  createAppContainer
} from 'react-navigation';

import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';

import ManagebacStack from './src/ManagebacStack';
import TasksStack from './src/TasksStack';
import ProfileStack from './src/ProfileStack';
import LoginCheckScreen from './src/screens/LoginCheckScreen';
import LoginScreen from './src/screens/LoginScreen';
import LogoutScreen from './src/screens/LogoutScreen';

import { colors } from './src/styles';

// The main app navigation stack.
// Screens made later on (individual message screens, feed, or whatever) will be added here
const AppStack = createMaterialBottomTabNavigator(
  {
    ManagebacTabs: ManagebacStack,
    TasksTabs: TasksStack,
    ProfileTabs: ProfileStack
  },
  {
    initialRouteName: 'ManagebacTabs',
    shifting: true,
    activeColor: colors.primary,
    inactiveColor: colors.inactive,
    barStyle: {
      backgroundColor: colors.white
    }
  }
);

// The login navigation stack
// Login authentication is an entirely different process and should be treated with a different
// navigation stack using a switchNavigator
const LoginStack = createStackNavigator(
  {
    Login: LoginScreen,
    Logout: LogoutScreen
  },
  {
    defaultNavigationOptions: {
      header: null // Hide the default empty header bar for all child elements
    }
  }
);

// https://reactnavigation.org/docs/en/auth-flow.html
// Switch navigators make sure the app nav stack and auth nav stack are two different things
// and that you can't back-button into one another
const AppContainer = createAppContainer(
  createSwitchNavigator({
    // Make sure no names for screens overlap (e.g. LoginStack and Login), since they are unique
    //  identifiers that can be navigated to from anywhere in the app
    LoginCheck: LoginCheckScreen,
    AppStack: AppStack, // navigators can contain navigators
    LoginStack: LoginStack
  },
  {
    initialRouteName: 'LoginCheck'
  })
);

export default class Root extends React.Component {
  // I'm sure we're going to have to use state managers like Redux, and when that happens,
  // wrap this AppContainer in a Store Provider.
  render() {
    return (<AppContainer />);
  }
}