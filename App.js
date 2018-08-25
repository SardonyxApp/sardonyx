import React from 'react';
import { Text, View, Linking } from 'react-native';
import Login from './src/Login';
import { styles } from './src/styles';

class App extends React.Component {
  render() {
    return (
      <View style={styles.containerAlignChildrenCenter} >
        <Text style={styles.h1}>This is the app!!</Text>
        <Text style={styles.p}>
          Sardonyx is not affiliated, associated, authorized, endorsed by, or in any way officially connected with ManageBac, or any of its subsidiaries or its affiliates. The official ManageBac website can be found at <Text onPress={() => Linking.openURL('https://www.managebac.com')} style={styles.link}>https://www.managebac.com</Text>.
        </Text>
      </View>
    );
  }
}

class Container extends React.Component {
  constructor() {
    super();
    this.state = {
      render: null
    };

    fetch('https://sardonyx.glitch.me/api/web/validate')
      .then(response => {
        if (response.status === 401) {
        //validation failed
          this.setState({
            render: <Login />
          });
        }

        else if (response.status === 200) {
        //validation succeeded
          this.setState({
            render: <Login />
          });
        }
      })
      .catch(error => {
        this.setState({
          render: <View style={styles.containerAlignChildrenCenter}><Text>There was an error while validating. Please retry. {error}</Text></View>
        });
      });
  }
  
  render() {
    return this.state.render;
  }
}

export default Container;
