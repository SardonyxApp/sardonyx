import React from 'react';
import { ScrollView } from 'react-native';

import { connect } from 'react-redux';

import { colors } from '../styles';
import Label from '../components/TasksSelectableLabel';

// This screen is for selecting labels for a task. To filter the tasklist with labels
class TasksLabelsSelectorScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subject_id: this.props.navigation.getParam('subject_id'),
      category_id: this.props.navigation.getParam('category_id')
    }

    this._handleChange = this._handleChange.bind(this);
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Edit labels'
    }
  }


  _handleChange(type, id) {
    this.props.navigation.state.params.onChange(type, this.state[type] === id ? null : id);

    this.setState(prevState => {
      prevState[type] = prevState[type] === id ? null : id;
      return prevState;
    });
  }

  render() {
    subjects = this.props.subjects
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(label => (
        <Label 
          key={label.name}
          label={label}
          list={[this.state.subject_id]}
          onFilter={() => this._handleChange('subject_id', label.id)}
        />
      ));

    categories = this.props.categories
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(label => (
        <Label 
          key={label.name}
          label={label}
          list={[this.state.category_id]}
          onFilter={() => this._handleChange('category_id', label.id)}
        />
      ));

    return (
      <ScrollView style={{ flex: 1, backgroundColor: colors.lightBackground, paddingVertical: 4 }}>
        {subjects}
        {categories}
      </ScrollView>
    );
  }
}

const mapStateToProps = state => {
  const subjects = state.labels.subjects;
  const categories = state.labels.categories;
  return { subjects, categories };
};

export default connect(mapStateToProps)(TasksLabelsSelectorScreen);