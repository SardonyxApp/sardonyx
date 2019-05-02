import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { Icon } from 'react-native-elements';
import { TouchableRipple } from 'react-native-paper';

import { fonts } from '../styles';

export default class TasksFilter extends React.PureComponent {
  constructor(props) {
    super(props);
    this._handleNavigate = this._handleNavigate.bind(this);
  }

  _handleNavigate() {
    this.props.navigation.navigate('LabelsFilter', {
      ...this.props
    })
  }

  render() {
    const subjects = this.props.subjects
      .filter(label => this.props.subjectsFilter.includes(label.id))
      .map(label => <Label label={label} onRemove={id => this.props.onFilter('subjectsFilter', id)} removable={true} />);

    const categories = this.props.categories
      .filter(label => this.props.categoriesFilter.includes(label.id))
      .map(label => <Label label={label} onRemove={id => this.props.onFilter('categoriesFilter', id)}  removable={true} />);

    return (
      <View id="tasks-filter" className="custom-scroll" style={filterStyles.container}>
        <TouchableRipple 
          onPress={this._handleNavigate}
          rippleColor="rgba(0, 0, 0, 0.16)"
        >
          <Icon 
            name="search"
            type="material"
            style={filterStyles.icon}
          /> 
        </TouchableRipple>
        {subjects}
        {categories}
        <TouchableRipple 
          onPress={this._handleNavigate}
          rippleColor="rgba(0, 0, 0, 0.16)"
        >
          {!subjects.length && !categories.length ? <Text className="overview-description" style={filterStyles.hint}>Filter labels...</Text> : null}
        </TouchableRipple>
        <TouchableRipple 
          onPress={this._handleNavigate}
          rippleColor="rgba(0, 0, 0, 0.16)"
        >
          <Icon 
            name="add"
            type="material"
            containerStyle={filterStyles.icon}
          />
        </TouchableRipple>
      </View>
    );
  }
}

const filterStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 16
  },
  icon: {
    height: 24,
    width: 24
  },
  hint: {
    ...fonts.jost400,
    fontSize: 16
  }
})