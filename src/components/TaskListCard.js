import React from 'react';
import { View, Text } from 'react-native';

export default TaskListCard = props => (
  <View
    className="card" 
    key={props.task.id} 
    onClick={() => props.onSelectTask(props.task.id)}
    style={{ backgroundColor: props.selected ? '#f6e6dc' : ''}}
  >
    <Text className="overview-title">{props.task.name}</Text>
    <Text className="overview-description">{props.task.description}</Text>
    {/* <View className="overview-dots" style={{ display: props.task.subject_id || props.task.category_id ? 'block' : 'none'}}>
      <View className="dot" style={{ backgroundColor: props.task.subject_color, display: props.task.subject_id ? 'block' : 'none' }}></View>
      <View className="dot" style={{ backgroundColor: props.task.category_color, display: props.task.category_id ? 'block' : 'none' }}></View>
    </View> */}
  </View>
);
