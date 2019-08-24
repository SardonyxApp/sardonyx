import React from 'react';

import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  RefreshControl,
  Alert,
  InteractionManager
} from 'react-native';

import { Icon } from 'react-native-elements';
import { BASE_URL } from '../../env';

import HeaderIcon from '../components/HeaderIcon';
import Timespan from '../components/Timespan';
import ExperienceUneditableWarning from '../components/ExperienceUneditableWarning';
import CTAButton from '../components/CTAButton';
import { Storage } from '../helpers';
import { styles, fonts, colors } from '../styles';

export default class ManagebacCASScreen extends React.Component {
  isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      refreshing: true,
      casExperienceData: {}
    };
    this._setEditableParam = this._setEditableParam.bind(this);
    this._onCTAPressed = this._onCTAPressed.bind(this);
    this._fetchExperienceData = this._fetchExperienceData.bind(this);
    this._onRefresh = this._onRefresh.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    InteractionManager.runAfterInteractions(this._onRefresh);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: `${navigation.state.params.title}`,
      headerRight: navigation.state.params.editable ? (
        <HeaderIcon
          onPress={() => {
            navigation.navigate('EditCASItem', {
              id: navigation.state.params.id
            });
          }}
        >
          <Icon name="edit" color={colors.white} />
        </HeaderIcon>
      ) : null
    };
  };

  /**
   * Set the "editable" property and "id" property for Navigation.
   * The ID is only used if editable is true.
   */
  _setEditableParam() {
    this.props.navigation.setParams({
      editable: this.state.casExperienceData.status !== 'complete',
      id: this.state.casExperienceData.id
    });
  }

  _onCTAPressed() {
    if (this.props.navigation.getParam('reflectionCount', 0) === null) {
      this.props.navigation.navigate('AddCASReflection', {
        id: this.state.casExperienceData.id
      });
      return;
    }
    this.props.navigation.navigate('ViewCASReflections', {
      editable: this.props.navigation.state.params.editable,
      id: this.state.casExperienceData.id
    });
  }

  /**
   * Sends a GET request to the API, sets State, and show Alert on error.
   * @param {String} credentials
   */
  async _fetchExperienceData(credentials) {
    const response = await fetch(BASE_URL + this.props.navigation.getParam('apiLink', '/404'), {
      method: 'GET',
      headers: {
        'Login-Token': credentials
      },
      mode: 'no-cors'
    });
    if (!this._isMounted) return;
    if (response.status === 200) {
      const data = await response.json();
      this.setState(
        {
          refreshing: false,
          casExperienceData: data.cas
        },
        this._setEditableParam
      );
      return;
    } else if (response.status === 404) {
      Alert.alert(
        'Not Found',
        'Your CAS experience could not be found.',
        []
      );
      this.props.navigation.goBack();
      return;
    }
  }

  /**
   * Called on load, and on pull-to-refresh. Asynchronously sets the state using newest experience data.
   */
  _onRefresh() {
    this.setState(
      {
        refreshing: true
      },
      async () => {
        this._fetchExperienceData(await Storage.retrieveCredentials());
      }
    );
  }

  render() {
    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
        }
      >
        <View style={casStyles.topFlexbox}>
          <Timespan
            timespan={
              'timespan' in this.state.casExperienceData
                ? this.state.casExperienceData.timespan
                : null
            }
          />
          {'reflectionCount' in this.state.casExperienceData ? (
            <CTAButton style={casStyles.ctaButton} onPress={this._onCTAPressed}>
              {this.props.navigation.getParam('reflectionCount', 0) === null &&
              this.props.navigation.state.params.editable
                ? 'ADD REFLECTION'
                : 'VIEW REFLECTIONS'}
            </CTAButton>
          ) : null}
        </View>
        {'description' in this.state.casExperienceData ? (
          <React.Fragment>
            <View style={casStyles.warnings}>
              <ExperienceUneditableWarning
                status={this.state.casExperienceData.status}
              />
            </View>
            <View style={casStyles.detailsContainer}>
              <Text style={casStyles.detailsHeading}>Description</Text>
              <Text>{decodeURI(this.state.casExperienceData.description)}</Text>
            </View>
            <View style={casStyles.detailsSeparator} />
            <View style={casStyles.detailsContainer}>
              <Text style={casStyles.detailsHeading}>
                Meeting Learning Outcomes
              </Text>
              <Text>
                {decodeURI(this.state.casExperienceData.learningOutcomes)}
              </Text>
            </View>
          </React.Fragment>
        ) : null}
      </ScrollView>
    );
  }
}

const casStyles = StyleSheet.create({
  ctaButton: {
    marginTop: -30
  },
  warnings: {
    marginTop: 16,
    flexDirection: 'column'
  },
  detailsContainer: {
    marginHorizontal: 16
  },
  detailsHeading: {
    fontSize: 16,
    paddingTop: 4,
    paddingBottom: 4,
    ...fonts.jost500
  },
  detailsSeparator: {
    marginVertical: 12,
    height: 1,
    backgroundColor: colors.gray1
  }
});
