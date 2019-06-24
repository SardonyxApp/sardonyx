import React from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import { TouchableRipple } from 'react-native-paper';

import { styles, fonts } from '../styles';

import Label from './TasksLabel';

export default class TasksFilter extends React.PureComponent {
  constructor(props) {
    super(props);
    this._handleNavigate = this._handleNavigate.bind(this);
  }

  _handleNavigate() {
    this.props.navigation.navigate('LabelsFilter', this.props);
  }

  render() {
    const subjects = this.props.subjects
      .filter(label => this.props.subjectsFilter.includes(label.id))
      .map(label => <Label key={label.name} label={label} onRemove={() => this.props.onFilter('subjectsFilter', label.id)} removable={true} />);

    const categories = this.props.categories
      .filter(label => this.props.categoriesFilter.includes(label.id))
      .map(label => <Label key={label.name} label={label} onRemove={() => this.props.onFilter('categoriesFilter', label.id)} removable={true} />);

    return (
      <View style={[filterStyles.container, filterStyles.containercontainer]}>
        <TouchableRipple 
            onPress={this._handleNavigate}
            rippleColor="rgba(0, 0, 0, 0.16)"
            style={[styles.icon, filterStyles.filterIcon]}
          >
            <Icon 
              name="filter"
              type="material-community"
              iconStyle={styles.icon}
            /> 
          </TouchableRipple>
        <ScrollView horizontal={true} contentContainerStyle={filterStyles.container}>
          {subjects}
          {categories}
          {!subjects.length && !categories.length 
          ? <Text 
              className="overview-description" 
              style={filterStyles.hint}
              onPress={this._handleNavigate}
            >
              Filter labels...
            </Text> 
          : null}
          <TouchableRipple 
            onPress={this._handleNavigate}
            rippleColor="rgba(0, 0, 0, 0.16)"
            style={styles.icon}
          >
            <Icon 
              name="add"
              type="material"
              iconStyle={styles.icon}
            />
          </TouchableRipple>
        </ScrollView>
      </View>
    );
  }
}

const filterStyles = StyleSheet.create({
  containercontainer: {
    marginTop: 16
  },
  filterIcon: {
    marginLeft: 12,
    marginRight: 4
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  hint: {
    ...fonts.jost400,
    fontSize: 16
  }
})