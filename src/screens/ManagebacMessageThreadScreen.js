import React from 'react';

import {
  View,
  ScrollView,
  Text,
  Image,
  RefreshControl,
  StyleSheet,
  InteractionManager,
  TextInput
} from 'react-native';

import { Icon } from 'react-native-elements';
import { TouchableRipple } from 'react-native-paper';
import HTMLView from 'react-native-htmlview';
import moment from 'moment';
import { BASE_URL } from '../../env';

import { Storage } from '../helpers';
import { colors } from '../styles';

export default class ManagebacMessageThreadScreen extends React.Component {
  isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      refreshing: true,
      textInputShownId: null,
      newCommentContent: '',
      messageData: {}
    };
    this._onRefresh = this._onRefresh.bind(this);
    this._fetchMessageThreadData = this._fetchMessageThreadData.bind(this);
    this._toggleTextInputVisibility = this._toggleTextInputVisibility.bind(
      this
    );
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
      async () => {
        this._fetchMessageThreadData(await Storage.retrieveCredentials());
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
        }).then(r => r.json().then(data => ({ response: r, data: data })))
      );
    });

    Promise.all(promises)
      .then(responses => ({
        // Convert to array of each
        responses: responses.map(response => response.response),
        datas: responses.map(response => response.data)
      }))
      .then(({ responses, datas }) => {
        if (!this._isMounted) return;
        responses.forEach((response, index) => {
          if (response.status === 200) {
            const data = datas[index];
            // Copy the object, and start updating it
            const stateMessageData = { ...this.state.messageData };
            id = response.url.substring(response.url.lastIndexOf('/') + 1);
            // Update the comments from boolean "true" to array of subcomments
            stateMessageData.comments.forEach(item => {
              if (item.id == id) {
                item.comments = data.replyOfReply;
              }
            });
            this.setState({
              messageData: stateMessageData
            });
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
  async _fetchMessageThreadData(credentials) {
    let url = this.props.navigation.getParam('link', '/404');
    const response = await fetch(BASE_URL + url, {
      method: 'GET',
      headers: {
        'Login-Token': credentials
      },
      mode: 'no-cors'
    });
    if (!this._isMounted) return;
    if (response.status === 200) {
      const parsedManagebacResponse = await response.json();
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
  }

  /**
   * Send a reply to the comment with the given id
   * @param {Integer} level
   * @param {Integer} id
   */
  async _sendNewComment(level, id) {
    let url = this.props.navigation.getParam('link', '/404');
    if (level === 1) url += '/reply';
    if (level === 2) url += '/reply/' + id;
    console.log(this.state.newCommentContent);
    const credentials = await Storage.retrieveCredentials();
    const response = await fetch(BASE_URL + url, {
      method: 'POST',
      headers: {
        'Login-Token': credentials,
        'Message-Data': JSON.stringify({
          body: this.state.newCommentContent,
          notifyViaEmail: 0,
          privateMessage: 0
        })
      },
      mode: 'no-cors'
    });
    if (!this._isMounted) return;
    this._onRefresh();
  }

  /**
   * Sets the state textInputShownId to the given id, toggles off if already set
   * @param {Integer} id
   */
  _toggleTextInputVisibility(id) {
    if (!('id' in this.state.messageData)) return;
    this.setState({
      textInputShownId: this.state.textInputShownId === id ? null : id
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
                    : require('../assets/logos/Icon.png')
                }
                style={messageThreadStyles.image}
              />
            </View>
            <View style={messageThreadStyles.messageTextInfo}>
              <Text style={messageThreadStyles.author}>{comment.author}</Text>
              <Text>
                {moment(comment.date).format('dddd, MMM Do YYYY, H:mm')}
              </Text>
            </View>
            {level !== 3 ? (
              <View style={messageThreadStyles.replyButtonContainer}>
                <TouchableRipple
                  onPress={() => {
                    this._toggleTextInputVisibility(comment.id);
                  }}
                >
                  <View style={messageThreadStyles.replyButton}>
                    <Icon name="reply" color={colors.darkBlue} size={16} />
                    <Text style={messageThreadStyles.replyButtonText}>
                      Reply
                    </Text>
                  </View>
                </TouchableRipple>
              </View>
            ) : null}
          </View>
          <HTMLView
            style={messageThreadStyles.content}
            value={`<html><body>${comment.content}</body></html>`}
          />
          {comment.id === this.state.textInputShownId ? (
            <View style={messageThreadStyles.replyContainer}>
              <TextInput
                style={messageThreadStyles.replyTextinput}
                autoFocus={true}
                onChangeText={newCommentContent => {
                  this.setState({ newCommentContent });
                }}
              />
              <View style={messageThreadStyles.replySendButtonContainer}>
                <TouchableRipple
                  onPress={() => {
                    this._sendNewComment(level, comment.id);
                  }}
                >
                  <View style={messageThreadStyles.replyButton}>
                    <Icon name="send" color={colors.darkBlue} size={16} />
                    <Text style={messageThreadStyles.replyButtonText}>
                      Send
                    </Text>
                  </View>
                </TouchableRipple>
              </View>
            </View>
          ) : null}
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
                    : require('../assets/logos/Icon.png')
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
                  ? moment(this.state.messageData.date).format(
                      'dddd, MMM Do YYYY, H:mm'
                    )
                  : moment(this.props.navigation.getParam('date')).format(
                      'dddd, MMM Do YYYY, H:mm'
                    )}
              </Text>
            </View>
            <View style={messageThreadStyles.replyButtonContainer}>
              <TouchableRipple
                onPress={() => {
                  this._toggleTextInputVisibility(this.state.messageData.id);
                }}
              >
                <View style={messageThreadStyles.replyButton}>
                  <Icon name="reply" color={colors.darkBlue} size={16} />
                  <Text style={messageThreadStyles.replyButtonText}>Reply</Text>
                </View>
              </TouchableRipple>
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
          {this.state.messageData.id === this.state.textInputShownId ? (
            <View style={messageThreadStyles.replyContainer}>
              <TextInput
                style={messageThreadStyles.replyTextinput}
                autoFocus={true}
                onChangeText={newCommentContent => {
                  this.setState({ newCommentContent });
                }}
              />
              <View style={messageThreadStyles.replySendButtonContainer}>
                <TouchableRipple
                  onPress={() => {
                    this._sendNewComment(1, this.state.messageData.id);
                  }}
                >
                  <View style={messageThreadStyles.replyButton}>
                    <Icon name="send" color={colors.darkBlue} size={16} />
                    <Text style={messageThreadStyles.replyButtonText}>
                      Send
                    </Text>
                  </View>
                </TouchableRipple>
              </View>
            </View>
          ) : null}
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
    elevation: 3,
    backgroundColor: colors.white,
    marginBottom: 16
  },
  level2: {
    elevation: 2,
    backgroundColor: colors.white,
    marginLeft: 16,
    marginBottom: 16
  },
  level3: {
    elevation: 1,
    backgroundColor: colors.white,
    marginLeft: 32,
    marginBottom: 16
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
    marginRight: 8
  },
  image: {
    height: 36,
    width: 36,
    borderRadius: 18
  },
  messageTextInfo: {
    flex: 1
  },
  author: {
    fontWeight: 'bold'
  },
  replyButtonContainer: {
    backgroundColor: colors.white,
    elevation: 4,
    borderRadius: 30,
    overflow: 'hidden',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  replyButton: {
    flex: 1,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center'
  },
  replyButtonText: {
    color: colors.darkBlue,
    fontSize: 14
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 8
  },
  replyContainer: {
    flexDirection: 'row'
  },
  replyTextinput: {
    backgroundColor: colors.lightBlue2,
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16
  },
  replySendButtonContainer: {
    right: 0,
    flexDirection: 'row',
    overflow: 'hidden'
  }
});
