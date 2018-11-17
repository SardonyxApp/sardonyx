import {
  createSwitchNavigator,
  createStackNavigator,
} from "react-navigation";

import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';

import HomeTabStack from './src/HomeTabStack';
import ChatTabStack from './src/ChatTabStack';
import ProfileTabStack from './src/ProfileTabStack';
import LoginCheckScreen from './src/screens/LoginCheckScreen';
import LoginScreen from './src/screens/LoginScreen';
import LogoutScreen from './src/screens/LogoutScreen';

// The Main app navigation stack.
// Screens made later on (individual message screens, feed, or whatever) will be added here
const AppBottomTabsStack = createMaterialBottomTabNavigator(
  {
    HomeTab: HomeTabStack,
    ChatTab: ChatTabStack,
    ProfileTab: ProfileTabStack
  },
  {
    initialRouteName: 'ChatTab',
    shifting: true,
    activeColor: '#d17b46',
    inactiveColor: '#c2c2c2',
    barStyle: { backgroundColor: '#fff' }
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
    navigationOptions: {
      header: null // Hide the default empty header bar for all child elements
    }
  }
);

// https://reactnavigation.org/docs/en/auth-flow.html
// Switch navigators make sure the app nav stack and auth nav stack are two different things
// and that you can't back-button into one another
export default createSwitchNavigator(
  {
    // Make sure no names for screens overlap (e.g. LoginStack and Login), since they are unique
    //  identifiers that can be navigated to from anywhere in the app
    LoginCheck: LoginCheckScreen,
    AppStack: AppBottomTabsStack, // navigators can contain navigators
    LoginStack: LoginStack
  },
  {
    initialRouteName: 'LoginCheck'
  }
);