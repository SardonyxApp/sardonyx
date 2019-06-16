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

  /**
   * Called on load, and on pull-to-refresh. Asynchronously sets the state using newest class data.
   */
  _onRefresh() { }

  render() {
    return (
      <View style={{padding: 16}}>
        <Text>This page is still a work-in-progress. At this time, use the PC version of ManageBac to edit your CAS experiences.</Text>
      </View>
    );
  }
}
