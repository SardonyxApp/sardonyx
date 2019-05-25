import React from 'react';
import { View, Text } from 'react-native';
import { Icon } from 'react-native-elements';

import { styles, fonts } from '../styles';

export default TaskDue = props => (
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8
    }}
  >
    <Icon 
      name="schedule"
      type="material"
      iconStyles={styles.icon}
    />
    <Text
      style={{
        ...fonts.jost300,
        fontSize: 16,
        paddingHorizontal: 8,
      }}
    >
      {props.due}
    </Text>
  </View>
);