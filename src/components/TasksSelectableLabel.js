import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import { TouchableRipple } from 'react-native-paper';

import { fonts } from '../styles';

export default (TasksSelectableLabel = ({ label, list, onFilter }) => (
  <View style={labelStyles.container}>
    <View
      style={[labelStyles.labelContainer, { backgroundColor: label.color }]}
    >
      <TouchableRipple
        onPress={onFilter}
        rippleColor="rgba(0, 0, 0, 0.16)"
        style={{ flex: 1 }}
      >
        <View style={labelStyles.label}>
          <Text style={labelStyles.labelName}>{label.name}</Text>
          {list.includes(label.id) ? (
            <Icon
              name="check"
              type="material"
              size={20}
              containerStyle={labelStyles.icon}
              color="white"
            />
          ) : null}
        </View>
      </TouchableRipple>
    </View>
  </View>
));

const labelStyles = StyleSheet.create({
  container: {
    marginHorizontal: 14,
    marginVertical: 4
  },
  labelContainer: {
    borderRadius: 1000,
    flex: 1
  },
  label: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center'
  },
  selected: {
    marginLeft: 4,
    marginRight: 4
  },
  labelName: {
    ...fonts.jost400,
    fontSize: 16,
    color: '#fff',
    flex: 1
  },
  icon: {
    marginLeft: 8
  }
});
