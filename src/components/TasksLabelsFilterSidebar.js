import React from 'react';
import { ScrollView, Text, FlatList } from 'react-native';
import { SafeAreaView } from 'react-navigation';

import Label from './TasksSelectableLabel';
import { colors } from '../styles';
import OverviewHeading from './OverviewHeading';

export default class TasksLabelsFilterSidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subjectsFilter: [],
      categoriesFilter: []
    };

    this._handleFilter = this._handleFilter.bind(this);
    this._renderSubjectFilter = this._renderSubjectFilter.bind(this);
    this._renderCategoriesFilter = this._renderCategoriesFilter.bind(this);
  }

  componentDidUpdate(oldProps) {
    if (
      oldProps.navigation.state.routes[0].params !==
      this.props.navigation.state.routes[0].params
    ) {
      const newParams = this.props.navigation.state.routes[0].params;
      if (typeof newParams !== 'object') return;
      this.setState({
        subjectsFilter:
          'subjectsFilter' in newParams ? newParams.subjectsFilter : [],
        categoriesFilter:
          'categoriesFilter' in newParams ? newParams.categoriesFilter : []
      });
    }
  }

  _handleFilter(filter, id) {
    this.setState(
      prevState => {
        const obj = {};
        obj[filter] = prevState[filter].includes(id)
          ? prevState[filter].filter(l => l !== id)
          : prevState[filter].concat([id]);
        return obj;
      },
      () => {
        this.props.navigation.state.routes[0].params.onFilter(filter, id);
      }
    );
  }

  _renderSubjectFilter({ item }) {
    return (
      <Label
        key={item.name}
        label={item}
        list={this.state.subjectsFilter}
        onFilter={() => this._handleFilter('subjectsFilter', item.id)}
      />
    );
  }

  _renderCategoriesFilter({ item }) {
    return (
      <Label
        key={item.name}
        label={item}
        list={this.state.categoriesFilter}
        onFilter={() => this._handleFilter('categoriesFilter', item.id)}
      />
    );
  }

  render() {
    const params = this.props.navigation.state.routes[0].params;
    let subjects = typeof params === 'object' && 'subjects' in params 
      ? params.subjects.sort((a, b) => a.name.localeCompare(b.name)) 
      : [];
    let categories = typeof params === 'object' && 'categories' in params
      ? params.categories.sort((a, b) => a.name.localeCompare(b.name))
      : [];

    return (
      <ScrollView>
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: colors.lightBackground,
            paddingTop: 8
          }}
        >
          <OverviewHeading style={{ marginBottom: 0 }}>
            Filter Tasks
          </OverviewHeading>
          <FlatList
            data={subjects}
            renderItem={this._renderSubjectFilter}
            keyExtractor={(item, _) => item.id.toString()}
            extraData={this.state}
          />
          <FlatList
            data={categories}
            renderItem={this._renderCategoriesFilter}
            keyExtractor={(item, _) => item.id.toString()}
            extraData={this.state}
          />
        </SafeAreaView>
      </ScrollView>
    );
  }
}
