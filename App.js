import React from 'react';

import {
  createSwitchNavigator,
  createAppContainer,
  createStackNavigator
} from 'react-navigation';
import { useScreens } from 'react-native-screens';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import * as Font from 'expo-font';
import { Provider } from 'react-redux';
import configureStore from './configureStore';
import { PersistGate } from 'redux-persist/integration/react';

import ManagebacStack from './src/ManagebacStack';
import ManagebacMessageEditorScreen from './src/screens/ManagebacMessageEditorScreen';
import ManagebacEditCASReflectionScreen from './src/screens/ManagebacEditCASReflectionScreen';
import ManagebacAddCASReflectionScreen from './src/screens/ManagebacAddCASReflectionScreen';
import TasksStack from './src/TasksStack';
import TasksLabelsFilterScreen from './src/screens/TasksLabelsFilterScreen';
import SettingsStack from './src/SettingsStack';
import LoginCheckScreen from './src/screens/LoginCheckScreen';
import LoginScreen from './src/screens/LoginScreen';

import { colors, fonts } from './src/styles';

const { store, persistor } = configureStore();

// Use native screens for faster performance in Navigators
useScreens();

// The main app navigation stack.
// Screens made later on (individual message screens, feed, or whatever) will be added here
const AppMaterialBottomBar = createMaterialBottomTabNavigator(
  {
    ManagebacTabs: ManagebacStack,
    TasksTabs: TasksStack,
    SettingsTabs: SettingsStack
  },
  {
    initialRouteName: 'ManagebacTabs',
    shifting: true,
    activeColor: colors.primary,
    inactiveColor: colors.inactive,
    barStyle: {
      backgroundColor: colors.white
    },
    navigationOptions: {
      header: null
    }
  }
);

// Here we define some screens that will go over the tab bar, such as Message Editors.
// We could also manually hide the tab bar in specific screens inside ManagebacTabs, but it leads
// to undesired glitchy keyboard effects
const AppStack = createStackNavigator(
  {
    AppMaterialBottomBar,
    MessageEditor: ManagebacMessageEditorScreen,
    EditCASReflection: ManagebacEditCASReflectionScreen,
    AddCASReflection: ManagebacAddCASReflectionScreen,
    LabelsFilter: TasksLabelsFilterScreen, // Choose labels for filtering the tasklist
  },
  {
    initialRouteName: 'AppMaterialBottomBar',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: colors.blue
      },
      headerTintColor: colors.white,
      headerTitleStyle: {
        fontWeight: 'normal',
        ...fonts.jost400
      }
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
      AppStack: AppStack,
      Login: LoginScreen
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
          <PersistGate loading={null} persistor={persistor}>
            <AppContainer />
          </PersistGate>
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
