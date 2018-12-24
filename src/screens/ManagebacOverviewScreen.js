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
      deadlines: []
    };
  }

  static navigationOptions({ navigation }) {
    return {
      title: 'Overview'
    };
  }

  componentDidMount() {
    let tmp_data = [
      {
        author: 'Yuto Takano',
        avatar: 'https://avatars1.githubusercontent.com/u/4458848?s=52&v=4',
        deadline: false,
        due: '2018-12-31T20:00:00.000Z',
        labels: ['Summative', 'Formative'],
        link: '/student/classes/10901407/assignments/a',
        title: 'Test title goes here. It can be extremely long as well.'
      }
    ];

    this._getOverviewData().then(data => {
      console.log(data);
      console.log(typeof data);
      console.log(data.deadlines);
      this.setState({
        deadlines: [...data.deadlines, ...tmp_data]
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

  render() {
    return (
      <FlatList
        style={deadlineListStyles.list}
        data={this.state.deadlines}
        renderItem={({ item }) => (
          <View style={deadlineListStyles.item}>
            <View style={deadlineListStyles.container}>
              <View style={deadlineListStyles.labels}>
                <View style={deadlineListStyles.label} />
              </View>
              <View style={deadlineListStyles.bodyView}>
                <View style={deadlineListStyles.text}>
                  <Text style={deadlineListStyles.title}>
                    {decodeURI(item.title)}
                  </Text>
                  <Text style={deadlineListStyles.subject}>Niology</Text>
                </View>
                <View style={deadlineListStyles.bottomInfo}>
                  <Text style={deadlineListStyles.dueTime}>{item.due}</Text>
                  <View style={deadlineListStyles.avatars}>
                    <Image
                      style={deadlineListStyles.avatar}
                      source={{ uri: item.avatar }}
                    />
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
    backgroundColor: '#f8f8fa'
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
    borderRadius: 6,
    height: 12,
    width: 12,
    backgroundColor: '#00aa00'
  },
  bodyView: {
    flex: 1,
    borderRadius: 8,
    backgroundColor: colors.white,
    minHeight: 50,
    elevation: 2,
    padding: 24
  },
  text: {
    marginBottom: 24
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 12,
    fontSize: 16,
    color: colors.black
  },
  subject: {
    fontSize: 14,
    color: colors.darkBackground
  }
});
