import React from 'react';

import {
  View,
  FlatList,
  StyleSheet,
  ScrollView,
  Image,
  Text
} from 'react-native';

import { Storage } from '../helpers';
import { colors } from '../styles';

export default class ManagebacOverviewScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      deadlines: [
        {
          'author': '',
          'avatar': 'https://managebac-production.s3.amazonaws.com/uploads/school/logo/10004416/school_logo.png',
          'deadline': false,
          'due': '2050-01-01T00:00:00.000Z',
          'labels': [],
          'link': 'Loading',
          'title': 'Loading'
        }
      ],
      allGroupsClasses: [
        {
          'link': 'Loading',
          'title': 'Please wait just a moment...'
        }
      ]
    };

    this._getGroupClassName = this._getGroupClassName.bind(this);
  }

  static navigationOptions({ navigation }) {
    return {
      title: 'Overview'
    };
  }

  componentDidMount() {
    this._getOverviewData().then(data => {
      console.log(data);
      this.setState({
        deadlines: [...data.deadlines],
        allGroupsClasses: [...data.groups, ...data.classes]
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

  _renderLabel(name, index) {
    let color;
    switch (name) {
      case 'Homework':
        color = '#2175c6';
        break;
      case 'Quiz':
        color = '#f16522';
        break;
      case 'Essay':
        color = '#3333cc';
        break;
      case 'Deadline':
        color = '#91181b';
        break;
      case 'Math IA':
        color = '#0072bc';
        break;
      case 'Assignment':
        color = '#0072bc';
        break;
      case 'Event':
        color = '#009900';
        break;
      case 'Workshop':
        color = '#528c00';
        break;
      case 'Take Home Assignment':
        color = '#2f3192';
        break;
      case 'Discussion':
        color = '#ed008c';
        break;
      case 'ToK':
        color = '#3333cc';
        break;
      case 'Paper':
        color = '#a2c400';
        break;
      case 'Summative':
        color = '#478cfe';
        break;
      case 'Formative':
        color = '#1aaf5d';
        break;
      case 'Extended Essay':
        color = '#cc3333';
        break;
      default:
        return;
    }
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
      <FlatList
        contentContainerStyle={deadlineListStyles.list}
        data={this.state.deadlines}
        renderItem={({ item }) => (
          <View style={deadlineListStyles.item}>
            <View style={deadlineListStyles.container}>
              <View style={deadlineListStyles.labels}>
                {item.labels.map(this._renderLabel)}
              </View>
              <View style={deadlineListStyles.bodyView}>
                <View style={deadlineListStyles.text}>
                  <Text style={deadlineListStyles.title}>
                    {decodeURI(item.title)}
                  </Text>
                  <Text style={deadlineListStyles.subject}>
                    {this._getGroupClassName(item.link)}
                  </Text>
                </View>
                <View style={deadlineListStyles.bottomInfo}>
                  <Text style={deadlineListStyles.dueTime}>{item.due}</Text>
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
    paddingBottom: 24
  },
  item: {
    marginTop: 12,
    marginBottom: 6
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: 12
  },
  labels: {
    paddingTop: 8,
    width: 36
  },
  label: {
    marginLeft: 6, // ((width:36+12) - 12) / 2 - 12
    marginBottom: 6,
    borderRadius: 6,
    height: 12,
    width: 12
  },
  bodyView: {
    flex: 1,
    flexDirection: 'column',
    borderRadius: 8,
    backgroundColor: colors.white,
    minHeight: 50,
    elevation: 3,
    padding: 24
  },
  text: {
    marginBottom: 6
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 12,
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
    textAlignVertical: 'center'
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
  }
});
