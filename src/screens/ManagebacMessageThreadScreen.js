import React from 'react';

import {
  View,
  ScrollView,
  Text,
  Image,
  RefreshControl,
  StyleSheet,
  InteractionManager
} from 'react-native';

import HTMLView from 'react-native-htmlview';
import { BASE_URL } from '../../env';

import { Storage } from '../helpers';
import { colors } from '../styles';

export default class ManagebacMessageThreadScreen extends React.Component {
  isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      refreshing: true,
      messageData: {}
    };
    this._onRefresh = this._onRefresh.bind(this);
    this._fetchMessageThreadData = this._fetchMessageThreadData.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    InteractionManager.runAfterInteractions(() => {
      this._onRefresh();
    });
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
   * Called on load, and on pull-to-refresh. Asynchronously sets the state using newest group data.
   */
  _onRefresh() {
    this.setState(
      {
        refreshing: true
      },
      () => {
        Storage.retrieveCredentials()
          .then(this._fetchMessageThreadData)
          .catch(err => {
            console.warn(err);
          });
      }
    );
  }

  /**
   * Sends multiple GET requests to the API for each comment that has subcomments, and updates the state
   * @param {String} credentials 
   */
  _fetchMessageSubCommentsData(credentials) {
    let url = this.props.navigation.getParam('link', '/404');
    const promises = [];
    this.state.messageData.comments.forEach(item => {
      // Don't send request if no sub comments are present for the comment
      if (!item.comments) return;
      promises.push(
        fetch(BASE_URL + url + '/reply/' + item.id, {
          method: 'GET',
          headers: {
            'Login-Token': credentials
          },
          mode: 'no-cors'
        })
      );
    });

    Promise.all(promises)
      .then(responses => {
        console.log(this._isMounted);
        if (!this._isMounted) return;
        responses.forEach(response => {
          if (response.status === 200) {
            const parsedManagebacResponse = JSON.parse(
              response.headers.map['managebac-data']
            );
            // Copy the object, and start updating it
            const stateMessageData = { ...this.state.messageData };
            id = response.url.substring(response.url.lastIndexOf('/') + 1);
            // Update the comments from boolean "true" to array of subcomments
            stateMessageData.comments.forEach(item => {
              if (item.id == id) {
                item.comments = parsedManagebacResponse.replyOfReply;
              }
            });
            this.setState(
              {
                messageData: stateMessageData
              }
            );
          }
        });
      })
      .then(() => {
        this.setState({
          refreshing: false
        });
      });
  }

  /**
   * Sends a GET request to the API, sets State, and show Alert on error.
   * @param {String} credentials
   */
  _fetchMessageThreadData(credentials) {
    let url = this.props.navigation.getParam('link', '/404');
    fetch(BASE_URL + url, {
      method: 'GET',
      headers: {
        'Login-Token': credentials
      },
      mode: 'no-cors'
    }).then(response => {
      if (!this._isMounted) return;
      if (response.status === 200) {
        const parsedManagebacResponse = JSON.parse(
          response.headers.map['managebac-data']
        );
        this.setState(
          {
            messageData: parsedManagebacResponse.message[0]
          },
          () => {
            this._fetchMessageSubCommentsData(credentials);
          }
        );
        return;
      } else if (response.status === 404) {
        Alert.alert('Not Found', 'Message could not be found.', []);
        this.props.navigation.goBack();
        return;
      }
    });
  }

  /**
   * Renders a comment or subcomment. The level is directly sent to the styling as "level" + level
   * @param {Object} comment 
   * @param {Integer} level 
   */
  _renderComment(comment, level = 2) {
    return (
      <View key={comment.id}>
        <View style={messageThreadStyles['level' + level]}>
          <View style={messageThreadStyles.messageInfo}>
            <View style={messageThreadStyles.imageContainer}>
              <Image
                source={
                  comment.avatar
                    ? {
                        uri: comment.avatar
                      }
                    : require('../logos/Icon.png')
                }
                style={messageThreadStyles.image}
              />
            </View>
            <View style={messageThreadStyles.messageTextInfo}>
              <Text style={messageThreadStyles.author}>{comment.author}</Text>
              <Text>{comment.date}</Text>
            </View>
          </View>
          <HTMLView
            style={messageThreadStyles.content}
            value={`<html><body>${comment.content}</body></html>`}
          />
        </View>
        {'comments' in comment &&
          Array.isArray(comment.comments) &&
          comment.comments.map(item => {
            return this._renderComment(item, 3);
          })}
      </View>
    );
  }

  render() {
    return (
      <ScrollView
        style={messageThreadStyles.page}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
        }
      >
        <View style={messageThreadStyles.topLevel}>
          <Text style={messageThreadStyles.title}>
            {'title' in this.state.messageData
              ? decodeURI(this.state.messageData.title)
              : this.props.navigation.getParam('title')}
          </Text>
          <View style={messageThreadStyles.messageInfo}>
            <View style={messageThreadStyles.imageContainer}>
              <Image
                source={
                  this.state.messageData.avatar
                    ? {
                        uri: this.state.messageData.avatar
                      }
                    : require('../logos/Icon.png')
                }
                style={messageThreadStyles.image}
              />
            </View>
            <View style={messageThreadStyles.messageTextInfo}>
              <Text style={messageThreadStyles.author}>
                {'author' in this.state.messageData
                  ? this.state.messageData.author
                  : this.props.navigation.getParam('author')}
              </Text>
              <Text>
                {'date' in this.state.messageData
                  ? this.state.messageData.date
                  : this.props.navigation.getParam('date')}
              </Text>
            </View>
          </View>
          <HTMLView
            style={messageThreadStyles.content}
            value={`<html><body>${
              'content' in this.state.messageData
                ? this.state.messageData.content
                : this.props.navigation.getParam('content')
            }</body></html>`}
          />
        </View>
        {'comments' in this.state.messageData &&
          this.state.messageData.comments.map(item => {
            return this._renderComment(item);
          })}
      </ScrollView>
    );
  }
}

const messageThreadStyles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.lightBackground
  },
  topLevel: {
    elevation: 2,
    backgroundColor: colors.white,
    marginBottom: 16
  },
  level2: {
    elevation: 1,
    backgroundColor: colors.white,
    marginLeft: 16,
    marginBottom: 8
  },
  level3: {
    elevation: 1,
    backgroundColor: colors.white,
    marginLeft: 32,
    marginBottom: 8
  },
  title: {
    fontSize: 18,
    marginVertical: 16,
    paddingHorizontal: 16,
    fontWeight: 'bold'
  },
  messageInfo: {
    backgroundColor: colors.lightBackground,
    paddingVertical: 4,
    paddingHorizontal: 16,
    flexDirection: 'row'
  },
  imageContainer: {
    justifyContent: 'center',
    width: 36,
    borderRadius: 12,
    marginRight: 8
  },
  image: {
    height: 36,
    width: 36
  },
  messageTextInfo: {
    flex: 1
  },
  author: {
    fontWeight: 'bold'
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 16
  }
});
