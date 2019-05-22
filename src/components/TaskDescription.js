import React from 'react';
import { View, Text } from 'react-native';

export default TaskDescription = props => (
  <View>
    <Text>{props.description}</Text>
  </View>
);