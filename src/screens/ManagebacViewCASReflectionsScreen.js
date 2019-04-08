import React from 'react';

import { ScrollView } from 'react-native';

export default class ManagebacViewCASReflectionsScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Reflections and Evidence'
    };
  };

  render() {
    return <ScrollView />;
  }
}
