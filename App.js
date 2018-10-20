import { createSwitchNavigator, createStackNavigator } from 'react-navigation';

import HomeScreen from './src/screens/HomeScreen';
import LoginCheckScreen from './src/screens/LoginCheckScreen';
import LoginScreen from './src/screens/LoginScreen';

// The Main app navigation stack.
// Screens made later on (individual message screens, feed, or whatever) will be added here
const AppStack = createStackNavigator(
  {
    Home: HomeScreen
  },
  {
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#d17b46'
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'normal'
      }
    }
  }
);

// The login navigation stack
// Login authentication is an entirely different process and should be treated with a different
// navigation stack using a switchNavigator
const LoginStack = createStackNavigator(
  {
    Login: LoginScreen
  },
  {
    navigationOptions: {
      header: null // Hide the default empty header bar
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
    AppStack: AppStack, // navigators can contain navigators
    LoginStack: LoginStack
  },
  {
    initialRouteName: 'LoginCheck'
  }
);