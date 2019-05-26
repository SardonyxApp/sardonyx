// TaskLabels (this) -> display labels for each task
// TasksLabel -> updatable/removable label
// TasksSelectableLabel -> checkable label

import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { Icon, Overlay } from 'react-native-elements';
import { fonts, styles } from '../styles';
import TasksLabel from './TasksLabel';
import Label from './TasksSelectableLabel';

export default class TaskLabels extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false
    };
  }

  render() {
    const task = this.props.task;

    const labels = [];
    if (task.subject_id) {
      labels.push(
        <TasksLabel 
          label={{
            name: task.subject_name, 
            color: task.subject_color
          }}
          key={task.subject_id}
          style={labelsStyles.label}
          onUpdate={() => this.setState({ isVisible: true })}
          updatable={true}
        />
      );
    }

    if (task.category_id) {
      labels.push(
        <TasksLabel 
          label={{
            name: task.category_name,
            color: task.category_color
          }}
          key={task.category_id}
          style={labelsStyles.label}
          onUpdate={() => this.setState({ isVisible: true })}
          updatable={true}
        />
      );
    }

    return (
      <ScrollView 
        horizontal={true} 
        contentContainerStyle={labelsStyles.labelsContainer}
      >
        <Icon 
          name="label"
          type="material"
          iconStyle={styles.icon}
        />
        {!!labels.length 
          ? <View style={labelsStyles.labelsWrapper}>{labels}</View>
          : <Text 
            onPress={() => this.setState({ isVisible: true })}
            style={labelsStyles.noLabelsText}
          >
            No labels set.
          </Text>
        }
      </ScrollView>
    );

  }
}

const labelsStyles = StyleSheet.create({
  labelsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8
  },
  labelsWrapper: {
    paddingHorizontal: 8,
    flexDirection: 'row'
  },
  label: {
    padding: 8
  },
  noLabelsText: {
    ...fonts.jost300,
    fontSize: 16,
    paddingHorizontal: 8
  }
});