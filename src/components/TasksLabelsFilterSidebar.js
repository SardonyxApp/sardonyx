import React from 'react';
import { ScrollView, FlatList } from 'react-native';
import { SafeAreaView } from 'react-navigation';

import { connect } from 'react-redux';

import Label from './TasksSelectableLabel';
import OverviewHeading from './OverviewHeading';
import { colors } from '../styles';

class TasksLabelsFilterSidebar extends React.Component {
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
      this.setState({
        subjectsFilter: newParams.subjectsFilter,
        categoriesFilter: newParams.categoriesFilter
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
    const subjects = this.props.subjects.sort((a, b) => a.name.localeCompare(b.name));
    const categories = this.props.categories.sort((a, b) => a.name.localeCompare(b.name));
    
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

const mapStateToProps = state => {
  const subjects = state.labels.subjects;
  const categories = state.labels.categories;
  return { subjects, categories };
};

export default connect(mapStateToProps)(TasksLabelsFilterSidebar);