import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { fonts, styles } from '../styles';

export default TaskListCard = props => (
  <View
    className="card" 
    onClick={() => props.onSelectTask(props.task.id)}
    style={cardStyles.card}
  >
    <Text 
      className="overview-title" 
      style={cardStyles.title}
      numberOfLines={1}
      ellipsizeMode={'tail'}
    >
      {decodeURI(props.task.name)}
    </Text>
    <Text 
      className="overview-description" 
      style={cardStyles.description}
      numberOfLines={1}
      ellipsizeMode={'tail'}
    >
      {decodeURI(props.task.description)}
    </Text>

    {props.task.subject_id || props.task.category_id 
    ? <View className="overview-dots" style={cardStyles.dots}>
        {props.task.subject_id ? <View className="dot" style={[cardStyles.dot, { backgroundColor: props.task.subject_color }]}></View> : null}
        {props.task.category_id ? <View className="dot" style={[cardStyles.dot, { backgroundColor: props.task.category_color }]}></View> : null}
      </View>
    : null}
  </View>
);

const cardStyles = StyleSheet.create({
  card: {
    ...styles.padding10,
    backgroundColor: '#fff',
    borderRadius: 12,
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
    height: 12,
    marginTop: 4,
    flexDirection: 'row'
  },
  dot: {
    height: 12,
    width: 12,
    borderRadius: 6,
    marginHorizontal: 2
  }
});