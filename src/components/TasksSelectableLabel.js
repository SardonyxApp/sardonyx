import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import { TouchableRipple } from 'react-native-paper';

import { fonts } from '../styles';

export default TasksSelectableLabel = ({label, list, onFilter}) => (
  <TouchableRipple
    onPress={onFilter} 
    rippleColor="rgba(0, 0, 0, 0.16)"
  >
    <View
      style={[labelStyles.label, { backgroundColor: label.color }]}
    >
      <Text style={labelStyles.labelName}>{label.name}</Text>
      {list.includes(label.id) 
      ? <Icon name="check" type="material" size={16} containerStyle={labelStyles.icon} color="white" />
      : null}
    </View>
  </TouchableRipple>
);

const labelStyles = StyleSheet.create({
  label: {
    margin: 4,
    borderRadius: 4,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center'
  },
  labelName: {
    ...fonts.jost400,
    fontSize: 16,
    color: '#fff'
  },
  icon: {
    marginLeft: 4
  }
});