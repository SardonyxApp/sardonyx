import React from 'react';

import { ScrollView } from 'react-native';

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
      title: `${navigation.state.params.id}`
    };
  };

  /**
   * Called on load, and on pull-to-refresh. Asynchronously sets the state using newest class data.
   */
  _onRefresh() { }

  render() {
    return <ScrollView />;
  }
}
