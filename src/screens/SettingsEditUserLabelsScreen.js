import React from 'react';
import { ScrollView, ActivityIndicator, Platform, StatusBar } from 'react-native';
import Label from '../components/TasksSelectableLabel';

import { Storage } from '../helpers';
import { fonts, colors } from '../styles';
import { BASE_URL } from '../../env';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setUserLabels, setLabels, addUserLabels, deleteUserLabels } from '../actions';

class SettingsEditUserLabelsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subjects: [], // user default subjects
      categories: [] // user default categories 
    };

    this._handleFilter = this._handleFilter.bind(this);
  }

  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Update default labels',
    headerTitleStyle: {
      fontWeight: 'normal',
      ...fonts.jost400
    }
  })

  /**
   * Set the status bar color to white.
   */
  _setStatusBar() {
    StatusBar.setBackgroundColor(colors.white);
    StatusBar.setBarStyle('dark-content');
  }

  async componentDidMount() {
    Platform.OS === 'android' &&
      this.props.navigation.addListener('willFocus', this._setStatusBar);

    // If default user labels are not already loaded by TasksScreen, load here
    if (!this.props.userLabels.loaded) {
      const token = await Storage.retrieveValue('sardonyxToken');
      const sardonyxToken = { 'Sardonyx-Token': token };

      const user = await fetch(`${BASE_URL}/app/user`, { headers: sardonyxToken }).then(r => r.json());
      const subjects = await fetch(`${BASE_URL}/app/subjects`, { headers: sardonyxToken }).then(r => r.json());
      const categories = await fetch(`${BASE_URL}/app/categories`, { headers: sardonyxToken }).then(r => r.json());

      this.props.setUserLabels(user.subjects, user.categories);
      this.props.setLabels(subjects, categories);

      this.setState({
        subjects: user.subjects,
        categories: user.categories
      });
    } else {
      this.setState({
        subjects: this.props.userLabels.subjects,
        categories: this.props.userLabels.categories
      });
    }
  }

  async _handleFilter(filter, id) {
    let method;
    if (!this.state[filter].includes(id)) {
      this.props.addUserLabels(filter, id);
      method = 'POST';
    } else {
      this.props.deleteUserLabels(filter, id);
      method = 'DELETE';
    }

    this.setState(prevState => {
      prevState[filter] = prevState[filter].includes(id) ? prevState[filter].filter(l => l !== id) : prevState[filter].concat([id]);
      return prevState;
    });

    const token = await Storage.retrieveValue('sardonyxToken');
    fetch(`${BASE_URL}/app/user/${filter}?id=${id}`, {
      method,
      headers: {
        'Sardonyx-Token': token 
      }
    }).catch(err => {
      alert('There was an error while updating default labels. If this error persists, please contact SardonyxApp.');
      console.error(err);
    });
  }

  render() {
    let subjects = this.props.labels.subjects;
    let categories = this.props.labels.categories;

    subjects = subjects.map(label => (
      <Label 
        key={label.name}
        label={label}
        list={this.state.subjects}
        onFilter={() => this._handleFilter('subjects', label.id)}
      />
    ));

    categories = categories.map(label => (
      <Label 
        key={label.name}
        label={label}
        list={this.state.categories}
        onFilter={() => this._handleFilter('categories', label.id)}
      />
    ));

    return (
      <ScrollView style={{ flex: 1, backgroundColor: colors.lightBackground, paddingTop: 8 }}>
        <ActivityIndicator 
          animating={!this.props.userLabels.loaded} 
          style={{ display: !this.props.userLabels.loaded ? 'flex' : 'none', marginTop: 8 }} 
          color={colors.primary}
        />
        {subjects}
        {categories}
      </ScrollView>
    )
  }
}

const mapStateToProps = state => ({ labels: state.labels, userLabels: state.userLabels });
const mapDispatchToProps = dispatch => bindActionCreators({ setUserLabels, setLabels, addUserLabels, deleteUserLabels }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsEditUserLabelsScreen);