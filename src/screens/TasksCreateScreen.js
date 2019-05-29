import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import { Button} from 'react-native-elements';

import { fonts, styles, colors } from '../styles';

export default TasksCreateScreen = props => (
  <ScrollView style={createStyles.container}>
    <Text
      style={createStyles.heading}
    >
      CREATE
    </Text>

    <Button 
      title="Add task"
      type="solid"
      buttonStyle={{ backgroundColor: colors.primary }}
      containerStyle={styles.padding10}
      titleStyle={fonts.jost300}
    />
    <Button 
      title="Add subject label"
      type="solid"
      buttonStyle={{ backgroundColor: colors.primary }}
      containerStyle={styles.padding10}
      titleStyle={fonts.jost300}
    />
    <Button 
      title="Add category label"
      type="solid"
      buttonStyle={{ backgroundColor: colors.primary }}
      containerStyle={styles.padding10}
      titleStyle={fonts.jost300}
    />

    <Text
      style={createStyles.heading}
    >
      MANAGE
    </Text>
    <Button 
      title="Manage subject labels"
      type="solid"
      buttonStyle={{ backgroundColor: colors.blue }}
      containerStyle={styles.padding10}
      titleStyle={fonts.jost300}
    />
    <Button 
      title="Manage category labels"
      type="solid"
      buttonStyle={{ backgroundColor: colors.blue }}
      containerStyle={styles.padding10}
      titleStyle={fonts.jost300}
    />
  </ScrollView>
);

const createStyles = {
  container: {
    padding: 8
  },
  heading: {
    ...fonts.jost400,
    fontSize: 18,
    marginTop: 4
  }
}