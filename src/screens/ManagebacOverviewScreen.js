import React from 'react';

import {
  View,
  SectionList,
  StyleSheet,
  RefreshControl,
  Image,
  Text
} from 'react-native';

import { BASE_URL } from 'react-native-dotenv';

import { Storage } from '../helpers';
import { colors, labelColors, fonts } from '../styles';
import { TouchableRipple } from 'react-native-paper';
import ExtendedDeadline from '../components/ExtendedDeadline';

export default class ManagebacOverviewScreen extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      refreshing: true,
      extendedDeadlines: [],
      deadlines: [
        {
          title: 'Loading',
          data: [
            {
              author: '',
              avatar:
                'https://managebac-production.s3.amazonaws.com/uploads/school/logo/10004416/school_logo.png',
              deadline: false,
              due: '2050-01-01T00:00:00.000Z',
              labels: [],
              link: 'Loading',
              title: 'Loading'
            }
          ]
        }
      ],
      allGroupsClasses: [
        {
          link: 'Loading',
          title: 'Please wait just a moment...'
        }
      ]
    };

    this._getGroupClassName = this._getGroupClassName.bind(this);
    this._onRefresh = this._onRefresh.bind(this);
  }

  static navigationOptions({ navigation }) {
    return {
      title: 'Overview'
    };
  }

  componentDidMount() {
    this._getOverviewData().then(data => {
      console.log(data);
      sortedDeadlines = this._sortDeadlineArray(data.deadlines);
      this.setState({
        refreshing: false,
        deadlines: [...sortedDeadlines],
        allGroupsClasses: [...data.groups, ...data.classes]
      });
    });
  }

  /**
   * Set the refreshing controller as visible, and make a request to /dashboard to refresh data.
   */
  _onRefresh() {
    this.setState({
      refreshing: true
    });
    Storage.retrieveCredentials().then(credentials => {
      fetch(BASE_URL + '/api/dashboard', {
        method: 'GET',
        headers: {
          'Login-Token': credentials
        },
        mode: 'no-cors'
      }).then(response => {
        if (response.status === 200) {
          Storage.writeValue(
            'managebacOverview',
            response.headers.map['managebac-data']
          )
            .then(() => {
              this.setState({
                refreshing: false
              });
            })
            .catch(() => {});
          return;
        }
      });
    });
  }

  _getOverviewData() {
    return new Promise(resolve => {
      Storage.retrieveValue('managebacOverview').then(data => {
        resolve(JSON.parse(data));
      });
    });
  }

  /**
   * Put raw deadline data into a array sorted by date to be used in SectionList
   * @param {Array} deadlines
   */
  _sortDeadlineArray(deadlines) {
    let sorted = [];
    deadlines.forEach(deadline => {
      dueDate = Date.parse(deadline.due);
      // If deadline section already exists then put the deadline in there, otherwise create a section
      let index = sorted.findIndex(element => element.title === dueDate);
      if (index !== -1) {
        sorted[index].data.push(deadline);
        return;
      }
      sorted.push({
        title: dueDate,
        data: [deadline]
      });
    });
    return sorted;
  }

  /**
   * Return a <View /> styled with the name as an identifier, and set index as its index in list
   * @param {String} name
   * @param {Integer} index
   */
  _renderLabel(name, index) {
    let color = labelColors(name);
    return (
      <View
        key={index}
        style={{ ...deadlineListStyles.label, backgroundColor: color }}
      />
    );
  }

  _getGroupClassName(link) {
    let groupClass = this.state.allGroupsClasses.find(item => {
      return link.includes(item.link);
    });
    return groupClass ? decodeURI(groupClass.title) : '';
  }

  render() {
    let i = 0;

    return (
      <SectionList
        contentContainerStyle={deadlineListStyles.list}
        sections={this.state.deadlines}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
        }
        renderSectionHeader={({ section }) => {
          let sectionTitle = new Date(section.title);
          let weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
          return (
            <View style={deadlineListStyles.section}>
              <Text style={[deadlineListStyles.sectionWeekdayLabel, fonts.jost400]}>
                {weekdays[sectionTitle.getDay()]}
              </Text>
              <Text style={[deadlineListStyles.sectionDateLabel, fonts.jost400]}>
                {sectionTitle.getDate()}
              </Text>
            </View>
          );
        }}
        renderItem={({ item, index, section }) => (
          <View style={deadlineListStyles.item}>
            <View style={deadlineListStyles.container}>
              <View style={deadlineListStyles.mainContainer}>
                <View style={deadlineListStyles.labels}>
                  {item.labels.map(this._renderLabel)}
                </View>
                <View style={deadlineListStyles.bodyView}>
                  <TouchableRipple
                    onPress={() => {
                      let index = this.state.extendedDeadlines.indexOf(
                        item.link
                      );
                      if (index === -1) {
                        this.setState({
                          extendedDeadlines: [
                            ...this.state.extendedDeadlines,
                            item.link
                          ]
                        });
                      } else {
                        this.setState({
                          extendedDeadlines: this.state.extendedDeadlines.filter(
                            (_, i) => i !== index
                          )
                        });
                      }
                    }}
                    rippleColor={colors.lightBackground}
                  >
                    <View style={deadlineListStyles.innerBodyView}>
                      <View style={deadlineListStyles.text}>
                        <Text style={[deadlineListStyles.title, fonts.jost400]}>
                          {decodeURI(item.title)}
                        </Text>
                        <Text style={[deadlineListStyles.subject, fonts.jost400]}>
                          {this._getGroupClassName(item.link)}
                        </Text>
                      </View>
                      <View style={deadlineListStyles.bottomInfo}>
                        <Text style={[deadlineListStyles.dueTime, fonts.jost400]}>
                          {item.due}
                        </Text>
                        <View style={deadlineListStyles.avatars}>
                          <View style={deadlineListStyles.avatarContainer}>
                            <Image
                              style={deadlineListStyles.avatar}
                              source={{ uri: item.avatar }}
                            />
                          </View>
                        </View>
                      </View>
                    </View>
                  </TouchableRipple>
                </View>
              </View>
              {this.state.extendedDeadlines.indexOf(item.link) !== -1 && (
                <ExtendedDeadline
                  style={deadlineListStyles.extendedBodyContainer}
                  id={item.link}
                />
              )}
            </View>
          </View>
        )}
        keyExtractor={item => item.link}
      />
    );
  }
}

const deadlineListStyles = StyleSheet.create({
  list: {
    backgroundColor: '#f8f8fa',
    paddingBottom: 24,
    minHeight: '100%'
  },
  section: {
    position: 'absolute',
    width: 56,
    marginTop: 12,
    marginLeft: 12
  },
  sectionWeekdayLabel: {},
  sectionDateLabel: {},
  item: {
    flex: 1,
    marginTop: 12,
    marginBottom: 6
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    marginHorizontal: 12,
    marginLeft: 56
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  labels: {
    width: 6,
    elevation: 2
  },
  label: {
    flex: 1,
    flexDirection: 'column',
    width: 6
  },
  bodyView: {
    flex: 1,
    flexDirection: 'column',
    borderRadius: 8,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    backgroundColor: colors.white,
    elevation: 2,
    overflow: 'hidden'
  },
  innerBodyView: {
    minHeight: 50,
    paddingHorizontal: 24,
    paddingVertical: 12
  },
  text: {
    marginBottom: 2
  },
  title: {
    fontWeight: 'normal',
    marginBottom: 4,
    fontSize: 16,
    color: colors.black
  },
  subject: {
    fontSize: 14,
    color: colors.darkBackground,
    fontWeight: '200'
  },
  bottomInfo: {
    marginTop: 6,
    flex: 1,
    flexDirection: 'row'
  },
  dueTime: {
    textAlignVertical: 'center',
    color: colors.gray2
  },
  avatars: {
    flex: 1,
    alignItems: 'flex-end',
    height: 36
  },
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    elevation: 2
  },
  avatar: {
    flex: 1
  },
  extendedBodyContainer: {
    backgroundColor: '#FCFCFD',
    paddingHorizontal: 24,
    paddingVertical: 12,
    elevation: 1
  }
});
