import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { fonts, styles } from '../styles';

export default TaskListCard = props => (
  <View
    className="card" 
    onClick={() => props.onSelectTask(props.task.id)}
    style={cardStyles.card}
  >

    {props.task.subject_id || props.task.category_id 
    ? <View className="overview-dots" style={cardStyles.dots}>
        {props.task.subject_id ? <View className="dot" style={[cardStyles.dot, { backgroundColor: props.task.subject_color }]}></View> : null}
        {props.task.category_id ? <View className="dot" style={[cardStyles.dot, { backgroundColor: props.task.category_color }]}></View> : null}
      </View>
    : null}
    
    <Text 
      className="overview-title" 
      style={cardStyles.title}
      numberOfLines={1}
      ellipsizeMode="tail"
    >
      {decodeURIComponent(props.task.name)}
    </Text>
    <Text 
      className="overview-description" 
      style={cardStyles.description}
      numberOfLines={1}
      ellipsizeMode="tail"
    >
      {props.task.description === null ? null : decodeURIComponent(props.task.description)}
    </Text>
  </View>
);

const cardStyles = StyleSheet.create({
  card: {
    ...styles.padding10,
    backgroundColor: '#fff',
    borderRadius: 2,
    marginTop: 12,
    flex: 1
  },
  title: {
    ...fonts.jost300,
    fontSize: 18
  },
  description: {
    ...fonts.jost300,
    fontSize: 14
  },
  dots: {
    height: 6,
    marginBottom: 4,
    flexDirection: 'row'
  },
  dot: {
    height: 6,
    width: 18,
    marginHorizontal: 2
  }
});