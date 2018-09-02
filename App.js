import React from 'react';
import {
  Text,
  View
} from 'react-native';
import Login from './src/Login';
import { styles } from './src/styles';

class App extends React.Component {

  render() {

    return (
      <View style={styles.containerAlignChildrenCenter} >
        <Text style={styles.h1}>This is the app!!</Text>
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

    fetch('https://sardonyx.glitch.me/api/validate')
      .then(response => {
        if (response.status === 401) {
        //validation failed
          this.setState({
            render: <Login error='Login failed, please try again.' />
          });
        }

        else if (response.status === 200) {
        //validation succeeded
          this.setState({
            render: <App />
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
