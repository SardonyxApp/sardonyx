import React from 'react';
import { View, Text } from 'react-native';
import { Icon } from 'react-native-elements';

import { styles, fonts } from '../styles';

export default TaskDelete = props => (
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8
    }}
  >
    <Icon 
      name="delete"
      type="material"
      iconStyles={styles.icon}
      color="#f44138"
    />
    <Text
      style={{
        ...fonts.jost300,
        fontSize: 16,
        paddingHorizontal: 8,
        color: '#f44138'
      }}
    >
      Delete this task
    </Text>
  </View>
);