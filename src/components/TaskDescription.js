import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';

import { styles, fonts } from '../styles';

export default TaskDescription = props => (
  <View style={descriptionStyles.container}>
    <Icon 
      name="subject" // using this because the "notes" icon somehow does not load
      type="material"
      iconStyles={styles.icon}
    />
    <Text
      style={descriptionStyles.text}
    >
      {props.description}
    </Text>
  </View>
);

const descriptionStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8
  },
  text: {
    ...fonts.jost300,
    fontSize: 16,
    paddingHorizontal: 8
  }
});