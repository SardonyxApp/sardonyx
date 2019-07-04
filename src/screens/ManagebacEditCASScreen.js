import React from 'react';

import { Text, View } from 'react-native';

export default class ManagebacEditCASScreen extends React.Component {
  isMounted = false;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: `Editing CAS Item ${navigation.state.params.id}`
    };
  };

  render() {
    return (
      <View style={{padding: 16}}>
        <Text>At this time, editing a CAS experience's description isn't possible in this app. Please use the PC version of ManageBac to edit your CAS experiences.</Text>
      </View>
    );
  }
}
