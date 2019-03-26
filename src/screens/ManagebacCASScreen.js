import React from 'react';

import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  RefreshControl,
  Alert
} from 'react-native';

import { BASE_URL } from '../../env';

import { Storage } from '../helpers';
import { styles, fonts, colors } from '../styles';
import Timespan from '../components/Timespan';

export default class ManagebacCASScreen extends React.Component {
  isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      refreshing: true,
      casExperienceData: {}
    };
    this._onRefresh = this._onRefresh.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    this._onRefresh();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: `${navigation.state.params.title}`
    };
  };

  /**
   * Called on load, and on pull-to-refresh. Asynchronously sets the state using newest experience data.
   */
  _onRefresh() {
    this.setState(
      {
        refreshing: true
      },
      () => {
        Storage.retrieveCredentials().then(credentials => {
          fetch(
            BASE_URL + this.props.navigation.getParam('apiLink', '/404'),
            {
              method: 'GET',
              headers: {
                'Login-Token': credentials
              },
              mode: 'no-cors'
            }
          ).then(response => {
            if (!this._isMounted) return;
            if (response.status === 200) {
              this.setState({
                refreshing: false,
                casExperienceData: JSON.parse(
                  response.headers.map['managebac-data']
                ).cas
              });
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
          }).catch(error => {
            console.warn(error);
            return;
          });;
        })
        .catch(err => {
          console.warn(err);
        });
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
        <Timespan
          timespan={
            'timespan' in this.state.casExperienceData
              ? this.state.casExperienceData.timespan
              : null
          }
        />
        {'description' in this.state.casExperienceData ? (
          <View>
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
          </View>
        ) : null}
      </ScrollView>
    );
  }
}

const casStyles = StyleSheet.create({
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
