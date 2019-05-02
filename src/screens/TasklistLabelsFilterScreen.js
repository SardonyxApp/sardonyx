import React from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';

import { fonts } from '../styles';
import { TouchableRipple } from 'react-native-paper';

const Label = props => (
  <TouchableRipple
    onPress={props.onFilter} 
    rippleColor="rgba(0, 0, 0, 0.16)"
  >
    <View
      style={[labelStyles.label, { backgroundColor: props.label.color }]}
    >
      <Text style={labelStyles.labelName}>{props.label.name}</Text>
      {props.list.includes(props.label.id) 
      ? <Icon name="check" type="material" style={{width: 16, height: 16}} />
      : null}
    </View>
  </TouchableRipple>
  
);

export default class TasklistLabelsFilterScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Edit filter'
    }
  }

  render() {
    let subjects = this.props.navigation.getParam('subjects');
    let categories = this.props.navigation.getParam('categories');
    const subjectsFilter = this.props.navigation.getParam('subjectsFilter');
    const categoriesFilter = this.props.navigation.getParam('categoriesFilter');

    subjects = subjects.map(label => (
      <Label 
        key={label.name}
        label={label}
        list={subjectsFilter}
        onFilter={() => this.props.navigation.getParam('onFilter')('subjectsFilter', label.id)}
      />
    ));

    categories = categories.map(label => (
      <Label 
        key={label.name}
        label={label}
        list={categoriesFilter}
        onFilter={() => this.props.navigation.getParam('onFilter')('categoriesFilter', label.id)}
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
  },
  labelName: {
    ...fonts.jost400,
    fontSize: 16,
    color: '#fff'
  }
})