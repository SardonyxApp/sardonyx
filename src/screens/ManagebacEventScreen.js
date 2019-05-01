import React from 'react';

import {
  View,
  Text,
  StyleSheet,
  RefreshControl,
  Alert,
  ScrollView,
  FlatList
} from 'react-native';

import { BASE_URL } from '../../env';

import HTMLView from 'react-native-htmlview';
import CalendarDate from '../components/CalendarDate';
import NearDeadlineWarning from '../components/NearDeadlineWarning';
import { Storage } from '../helpers';
import { fonts, labelColors, colors } from '../styles';

export default class ManagebacEventScreen extends React.Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      refreshing: true,
      upcomingEventData: {}
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
      title: `${navigation.state.params.groupClassName}`
    };
  };

  /**
   * Called on load, and on pull-to-refresh. Asynchronously sets the state using newest event data.
   */
  _onRefresh() {
    this.setState(
      {
        refreshing: true
      },
      () => {
        Storage.retrieveCredentials()
          .then(credentials => {
            fetch(BASE_URL + this.props.navigation.getParam('link', '/404'), {
              method: 'GET',
              headers: {
                'Login-Token': credentials
              },
              mode: 'no-cors'
            }).then(response => {
              if (!this._isMounted) return;
              if (response.status === 200) {
                this.setState({
                  refreshing: false,
                  upcomingEventData: JSON.parse(
                    response.headers.map['managebac-data']
                  ).assignment
                });
                return;
              } else if (response.status === 404) {
                Alert.alert('Not Found', 'Your Event could not be found.', []);
                this.props.navigation.goBack();
                return;
              }
            });
          })
          .catch(err => {
            console.warn(err);
          });
      }
    );
  }

  /**
   * Returns a component that forms a single label. The color depends on the subject.
   * This functions is called in renderItem={}.
   * @param {{String}} {item}
   * @return {React.Component}
   */
  _renderLabels({ item }) {
    return (
      <View
        style={[
          eventStyles.label,
          {
            backgroundColor: labelColors(item) //temporary color
          }
        ]}
      >
        <Text style={eventStyles.labelText}>{item}</Text>
      </View>
    );
  }

  /**
   * Return the string 'HH:mm' in 24-hour format using the 'due' key from the event data in the
   * state or the navigation parameter.
   * @return {String}
   */
  _getDueTime() {
    let parsedDate;
    if ('due' in this.state.upcomingEventData) {
      parsedDate = new Date(Date.parse(this.state.upcomingEventData.due));
    } else {
      parsedDate = new Date(
        Date.parse(this.props.navigation.getParam('due', ''))
      );
    }
    if (!parsedDate) return 'All-day';
    return (
      ('0' + parsedDate.getHours()).slice(-2) +
      ':' +
      ('0' + parsedDate.getMinutes()).slice(-2)
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
        <View style={eventStyles.basicInfo}>
          <CalendarDate
            date={
              'due' in this.state.upcomingEventData
                ? new Date(Date.parse(this.state.upcomingEventData.due))
                : new Date(
                    Date.parse(this.props.navigation.getParam('due', ''))
                  )
            }
          />
          <View style={eventStyles.textInfo}>
            <View style={eventStyles.eventTitle}>
              <Text numberOfLines={1} style={eventStyles.titleText}>
                {'title' in this.state.upcomingEventData
                  ? decodeURI(this.state.upcomingEventData.title)
                  : this.props.navigation.getParam('title', '')}
              </Text>
            </View>
            <View style={eventStyles.timeAndLabels}>
              <Text style={eventStyles.dueTime}>{this._getDueTime()}</Text>
              <FlatList
                data={this.state.upcomingEventData.labels}
                renderItem={this._renderLabels}
                contentContainerStyle={eventStyles.labelContainer}
                keyExtractor={item => {
                  return item;
                }}
              />
              <View />
            </View>
          </View>
        </View>
        <View style={eventStyles.warnings}>
          <NearDeadlineWarning
            date={
              'due' in this.state.upcomingEventData
                ? new Date(Date.parse(this.state.upcomingEventData.due))
                : new Date(
                    Date.parse(this.props.navigation.getParam('due', ''))
                  )
            }
          />
        </View>
        <View style={eventStyles.detailsContainer}>
          <HTMLView
            value={
              'details' in this.state.upcomingEventData
                ? (this.state.upcomingEventData.details || 'No details provided.')
                : '<p />'
            }
            stylesheet={htmlStyles}
          />
        </View>
      </ScrollView>
    );
  }
}

const eventStyles = StyleSheet.create({
  basicInfo: {
    flex: 1,
    flexDirection: 'row'
  },
  textInfo: {
    flex: 1,
    flexDirection: 'column',
    paddingVertical: 16,
    marginRight: 16
  },
  eventTitle: {
    height: 36,
    justifyContent: 'center'
  },
  titleText: {
    fontSize: 18
  },
  timeAndLabels: {
    flexDirection: 'row'
  },
  dueTime: {
    paddingVertical: 2,
    marginRight: 8
  },
  labelContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  label: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    marginRight: 4
  },
  labelText: {
    ...fonts.jost400,
    color: colors.white
  },
  warnings: {
    flexDirection: 'column'
  },
  detailsContainer: {
    marginHorizontal: 16
  }
});

const htmlStyles = StyleSheet.create({
  p: {
    fontSize: 14
  }
});
