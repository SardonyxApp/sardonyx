// TaskLabels (this) -> display labels for each task
// TasksLabel -> updatable/removable label
// TasksSelectableLabel -> checkable label

import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import { fonts, styles } from '../styles';
import TasksLabel from './TasksLabel';

export default class TaskLabels extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subject_id: null,
      subject_name: null,
      subject_color: null,
      category_id: null,
      category_name: null,
      category_color: null
    };

    this._handleChange = this._handleChange.bind(this);
  }

  componentDidMount() {
    const { subject_id, subject_name, subject_color, category_id, category_name, category_color } = this.props.task;
    this.setState({ subject_id, subject_name, subject_color, category_id, category_name, category_color });
  }
  
  _handleChange(type, id) {
    if (type === 'subject_id') {
      const label = this.props.subjects.filter(s => s.id === id)[0];
      const obj = {
        id: this.props.task.id,
        subject_id: id,
        subject_name: label ? label.name : null,
        subject_color: label ? label.color : null
      };

      this.setState({
        subject_id: obj.id,
        subject_name: obj.subject_name,
        subject_color: obj.subject_color
      });

      this.props.onUpdateTask(obj);
    } else {
      const label = this.props.categories.filter(c => c.id === obj.category_id)[0];
      const obj = {
        id: this.props.task.id,
        category_id: id,
        category_name: label ? label.name : null,
        category_color: label ? label.color : null
      };

      this.setState({
        category_id: obj.id,
        category_name: obj.subject_name,
        category_color: obj.subject_color
      });
      
      this.props.onUpdateTask(obj);
    }
  }

  render() {
    const labels = [];
    if (this.state.subject_id) {
      labels.push(
        <TasksLabel 
          label={{
            name: this.state.subject_name, 
            color: this.state.subject_color
          }}
          key={this.state.subject_id}
          style={labelsStyles.label}
          onUpdate={() => this.props.navigation.navigate('LabelsSelector', { ...this.props, onChange: this._handleChange })}
          updatable={true}
        />
      );
    }

    if (this.state.category_id) {
      labels.push(
        <TasksLabel 
          label={{
            name: this.state.category_name,
            color: this.state.category_color
          }}
          key={this.state.category_id}
          style={labelsStyles.label}
          onUpdate={() => this.props.navigation.navigate('LabelsSelector', { ...this.props, onChange: this._handleChange })}
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
            onPress={() => this.props.navigation.navigate('LabelsSelector', { ...this.props, onChange: this._handleChange })}
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