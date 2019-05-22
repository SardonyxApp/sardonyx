import React from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';

import { fonts } from '../styles';

import { Icon } from 'react-native-elements';
import { TouchableRipple } from 'react-native-paper';

const Label = ({label, list, onFilter}) => (
  <TouchableRipple
    onPress={onFilter} 
    rippleColor="rgba(0, 0, 0, 0.16)"
  >
    <View
      style={[labelStyles.label, { backgroundColor: label.color }]}
    >
      <Text style={labelStyles.labelName}>{label.name}</Text>
      {list.includes(label.id) 
      ? <Icon name="check" type="material" size={16} containerStyle={labelStyles.icon} color="white" />
      : null}
    </View>
  </TouchableRipple>
);

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

const labelStyles = StyleSheet.create({
  label: {
    margin: 4,
    borderRadius: 4,
    padding: 12,
    flexDirection: 'row'
  },
  labelName: {
    ...fonts.jost400,
    fontSize: 16,
    color: '#fff'
  },
  icon: {
    marginLeft: 4
  }
});