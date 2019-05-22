import React from 'react';
import { View, Text } from 'react-native';

export default TaskDue = props => (
  <View>
    <Text>Due {props.due}</Text>
  </View>
);