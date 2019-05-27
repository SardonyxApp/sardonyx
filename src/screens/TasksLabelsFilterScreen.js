import React from 'react';
import { ScrollView } from 'react-native';
import Label from '../components/TasksSelectableLabel';

export default class TasksLabelsFilterScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subjectsFilter: this.props.navigation.getParam('subjectsFilter'),
      categoriesFilter: this.props.navigation.getParam('categoriesFilter')
    }

    this._handleFilter = this._handleFilter.bind(this);
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Edit filter'
    }
  }


  _handleFilter(filter, id) {
    this.setState(prevState => {
      prevState[filter] = prevState[filter].includes(id) ? prevState[filter].filter(l => l !== id) : prevState[filter].concat([id]);
      return prevState;
    });

    this.props.navigation.state.params.onFilter(filter, id);
  }

  render() {
    let subjects = this.props.navigation.getParam('subjects');
    let categories = this.props.navigation.getParam('categories');
    const subjectsFilter = this.state.subjectsFilter;
    const categoriesFilter = this.state.categoriesFilter;

    subjects = subjects.map(label => (
      <Label 
        key={label.name}
        label={label}
        list={subjectsFilter}
        onFilter={() => this._handleFilter('subjectsFilter', label.id)}
      />
    ));

    categories = categories.map(label => (
      <Label 
        key={label.name}
        label={label}
        list={categoriesFilter}
        onFilter={() => this._handleFilter('categoriesFilter', label.id)}
      />
    ));

    return (
      <ScrollView>
        {subjects}
        {categories}
      </ScrollView>
    );
  }
}
