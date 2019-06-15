import React from 'react';

import {
  createSwitchNavigator,
  createStackNavigator,
  createAppContainer
} from 'react-navigation';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import { Font } from 'expo';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducers from './src/reducers';

import ManagebacStack from './src/ManagebacStack';
import TasksStack from './src/TasksStack';
import SettingsStack from './src/SettingsStack';
import LoginCheckScreen from './src/screens/LoginCheckScreen';
import LoginScreen from './src/screens/LoginScreen';
import LogoutScreen from './src/screens/LogoutScreen';

import { colors } from './src/styles';

// Initialise the entire Redux Store with all reducers combined.
const store = createStore(reducers);

// The main app navigation stack.
// Screens made later on (individual message screens, feed, or whatever) will be added here
const AppStack = createMaterialBottomTabNavigator(
  {
    ManagebacTabs: ManagebacStack,
    TasksTabs: TasksStack,
    SettingsTabs: SettingsStack
  },
  {
    initialRouteName: store.getState().settings.general.firstScreenManagebac ? 'ManagebacTabs' : 'TasksTabs',
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
  createSwitchNavigator(
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
  )
);

export default class Root extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fontLoaded: false
    };
  }

  componentDidMount() {
    Font.loadAsync({
      'Jost-200': require('./src/assets/Jost-200-Thin.otf'),
      'Jost-300': require('./src/assets/Jost-300-Light.otf'),
      'Jost-400': require('./src/assets/Jost-400-Book.otf'),
      'Jost-500': require('./src/assets/Jost-500-Medium.otf'),
      'Jost-800': require('./src/assets/Jost-800-Heavy.otf')
    }).then(() => {
      this.setState({
        fontLoaded: true
      });
    });
  }
  // I'm sure we're going to have to use state managers like Redux, and when that happens,
  // wrap this AppContainer in a Store Provider.
  render() {
    return (
      this.state.fontLoaded && (
        <Provider store={store}>
          <AppContainer />
        </Provider>
      )
    );
  }
}

Expo.registerRootComponent(Root);

// To ignore warnings for WebSocket, which is completely fine to use.
// See this page: https://stackoverflow.com/questions/53638667/unrecognized-websocket-connection-options-agent-permessagedeflate-pfx
console.ignoredYellowBox = ['Remote debugger'];
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings([
  'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?'
]);
