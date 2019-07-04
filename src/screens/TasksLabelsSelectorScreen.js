import React from 'react';
import { ScrollView} from 'react-native';
import Label from '../components/TasksSelectableLabel';

import { colors } from '../styles';

// This screen is for selecting labels for a task. To filter the tasklist with labels, use TasksLabelsFilterScreen
export default class TasksLabelsSelectorScreen extends React.Component {
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
    let subjects = this.props.navigation.getParam('subjects').sort((a, b) => a.name.localeCompare(b.name));
    let categories = this.props.navigation.getParam('categories').sort((a, b) => a.name.localeCompare(b.name));

    subjects = subjects.map(label => (
      <Label 
        key={label.name}
        label={label}
        list={[this.state.subject_id]}
        onFilter={() => this._handleChange('subject_id', label.id)}
      />
    ));

    categories = categories.map(label => (
      <Label 
        key={label.name}
        label={label}
        list={[this.state.category_id]}
        onFilter={() => this._handleChange('category_id', label.id)}
      />
    ));

    return (
      <ScrollView style={{ flex: 1, backgroundColor: colors.lightBackground }}>
        {subjects}
        {categories}
      </ScrollView>
    );
  }
}