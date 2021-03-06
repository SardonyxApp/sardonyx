import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';

import { connect } from 'react-redux';

import { fonts, styles } from '../styles';
import TasksLabel from './TasksLabel';

// TaskLabels (this) -> display labels for each task
// TasksLabel -> updatable/removable label
// TasksSelectableLabel -> checkable label
class TaskLabels extends React.Component {
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
        subject_id: id,
        subject_name: label ? label.name : null,
        subject_color: label ? label.color : null
      };

      this.setState(obj);

      this.props.onUpdateTask({ id: this.props.task.id, ...obj });
    } else {
      const label = this.props.categories.filter(c => c.id === id)[0];
      const obj = {
        category_id: id,
        category_name: label ? label.name : null,
        category_color: label ? label.color : null
      };

      this.setState(obj);
      
      this.props.onUpdateTask({ id: this.props.task.id, ...obj });
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
          key="subject"
          onUpdate={() => this.props.navigation.navigate('LabelsSelector', { ...this.state, onChange: this._handleChange })}
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
          key="category"
          onUpdate={() => this.props.navigation.navigate('LabelsSelector', { ...this.state, onChange: this._handleChange })}
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
        {this.state.subject_id || this.state.category_id 
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

const mapStateToProps = state => {
  const subjects = state.labels.subjects;
  const categories = state.labels.categories;
  return { subjects, categories };
};

export default connect(mapStateToProps)(TaskLabels);

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
  noLabelsText: {
    ...fonts.jost300,
    fontSize: 16,
    paddingHorizontal: 8
  }
});