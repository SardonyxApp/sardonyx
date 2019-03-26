import React from 'react';

import { ScrollView } from 'react-native';

export default class ManagebacClassScreen extends React.Component {
  isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      refreshing: true,
      classOverviewData: {},
      classAssignmentsData: {},
      classMessagesData: {}
    };
    this._onRefresh = this._onRefresh.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    this._onRefresh();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: `${navigation.state.params.title}`
    };
  };

  /**
   * Called on load, and on pull-to-refresh. Asynchronously sets the state using newest class data.
   */
  _onRefresh() {}

  render() {
    return <ScrollView />;
  }
}
