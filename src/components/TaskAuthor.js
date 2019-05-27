import React from 'react';
import { View, Text } from 'react-native';
import { Icon } from 'react-native-elements';

import { styles, fonts } from '../styles';

export default TaskAuthor = props => (
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
      display: props.author ? 'flex' : 'none'
    }}
  >
    <Icon 
      name="person"
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
      Added by {props.author}
    </Text>
  </View>
);