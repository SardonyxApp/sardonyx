import React from 'react';

import { Text, View, Platform, StatusBar } from 'react-native';

export default class ManagebacEditCASScreen extends React.Component {
  isMounted = false;

  constructor(props) {
    super(props);
  }

  /**
   * Set the status bar color to blue.
   */
  _setStatusBar() {
    StatusBar.setBackgroundColor(colors.blue);
    StatusBar.setBarStyle('light-content');
  }

  componentDidMount() {
    Platform.OS === 'android' &&
      this.props.navigation.addListener('willFocus', this._setStatusBar);

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
      <View style={{ padding: 16 }}>
        <Text>
          At this time, editing a CAS experience's description isn't possible in
          this app. Please use the PC version of ManageBac to edit your CAS
          experiences.
        </Text>
      </View>
    );
  }
}
