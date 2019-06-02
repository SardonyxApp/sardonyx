import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
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
      .map(label => <Label key={label.name} label={label} onRemove={id => this.props.onFilter('subjectsFilter', id)} removable={true} />);

    const categories = this.props.categories
      .filter(label => this.props.categoriesFilter.includes(label.id))
      .map(label => <Label key={label.name} label={label} onRemove={id => this.props.onFilter('categoriesFilter', id)} removable={true} />);

    return (
      <ScrollView horizontal={true} contentContainerStyle={filterStyles.container}>
        <TouchableRipple 
          onPress={this._handleNavigate}
          rippleColor="rgba(0, 0, 0, 0.16)"
        >
          <Icon 
            name="search"
            type="material"
            iconStyle={styles.icon}
          /> 
        </TouchableRipple>
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
        >
          <Icon 
            name="add"
            type="material"
            iconStyle={styles.icon}
          />
        </TouchableRipple>
      </ScrollView>
    );
  }
}

const filterStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 4
  },
  hint: {
    ...fonts.jost400,
    fontSize: 16
  }
})