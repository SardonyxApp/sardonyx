import React from 'react';

import {
  View,
  ScrollView,
  Text,
  Image,
  RefreshControl,
  StyleSheet,
  InteractionManager,
  TextInput,
  Alert
} from 'react-native';

import { Icon } from 'react-native-elements';
import { TouchableRipple } from 'react-native-paper';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import HTMLView from 'react-native-htmlview';
import moment from 'moment';
import { connect } from 'react-redux';
import { BASE_URL } from '../../env';

import HeaderIcon from '../components/HeaderIcon';
import EndOfList from '../components/EndOfList';
import { Storage } from '../helpers';
import { colors, elevations } from '../styles';

class ManagebacMessageThreadScreen extends React.Component {
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
    this._confirmDelete = this._confirmDelete.bind(this);
    this._deleteMessage = this._deleteMessage.bind(this);
    this._fetchMessageThreadData = this._fetchMessageThreadData.bind(this);
    this._toggleTextInputVisibility = this._toggleTextInputVisibility.bind(
      this
    );
  }

  componentDidMount() {
    this._isMounted = true;
    InteractionManager.runAfterInteractions(() => {
      this.props.navigation.setParams({
        refreshPage: this._onRefresh,
        confirmDelete: this._confirmDelete,
        editable:
          this.props.user.id === this.props.navigation.state.params.authorId
      });
      this._onRefresh();
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  static navigationOptions = ({ navigation, navigationOptions }) => {
    return {
      title: `${navigation.state.params.title}`,
      headerRight: navigation.state.params.editable ? (
        <View style={messageThreadStyles.headerIcons}>
          <HeaderIcon
            onPress={() => {
              navigation.navigate('MessageEditor', {
                editMode: true,
                data: {
                  ...navigation.state.params
                },
                onGoBack: navigation.state.params.refreshPage
              });
            }}
          >
            <Icon name="edit" color={colors.white} />
          </HeaderIcon>
          <HeaderIcon onPress={navigation.state.params.confirmDelete}>
            <Icon name="delete" color={colors.white} />
          </HeaderIcon>
        </View>
      ) : null,
      headerTitleStyle: {
        paddingRight: 48,
        ...navigationOptions.headerTitleStyle
      }
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
   * Confirms the user if they really want to delete the message. Then calls _deleteMessage()
   */
  _confirmDelete() {
    Alert.alert(
      'Delete',
      'Are you sure you want to delete this message, including any comments?',
      [
        {
          text: 'No!'
        },
        {
          text: 'Yes, delete',
          onPress: this._deleteMessage
        }
      ]
    );
  }

  /**
   * Calls _requestDeleteMessage using credentials.
   */
  _deleteMessage() {
    this.setState(
      {
        refreshing: true
      },
      async () => {
        let url = this.props.navigation.getParam('link', '/404');
        const credentials = await Storage.retrieveCredentials();
        await fetch(
          BASE_URL + url, {
            method: 'DELETE',
            headers: {
              'Login-Token': credentials
            },
            mode: 'no-cors'
          }
        );
        if (!this._isMounted) return;
        if(this.props.navigation.getParam('onGoBack', null) !== null) {
          this.props.navigation.state.params.onGoBack();
        }
        this.props.navigation.goBack();
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
      // Set the navigation params so further editing works
      this.setState(
        {
          messageData: parsedManagebacResponse.message[0]
        },
        () => {
          this.props.navigation.setParams({
            title: decodeURI(parsedManagebacResponse.message[0].title),
            content: parsedManagebacResponse.message[0].content
          });
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
    const credentials = await Storage.retrieveCredentials();
    await fetch(BASE_URL + url, {
      method: 'POST',
      headers: {
        'Login-Token': credentials,
        'Message-Data': JSON.stringify({
          body: encodeURI(this.state.newCommentContent),
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
                    : require('../assets/logos/Icon-128.png')
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
                    : require('../assets/logos/Icon-128.png')
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
        <EndOfList />
        <KeyboardSpacer topSpacing={-150} />
      </ScrollView>
    );
  }
}

const messageThreadStyles = StyleSheet.create({
  headerIcons: {
    flexDirection: 'row'
  },
  page: {
    flex: 1,
    backgroundColor: colors.lightBackground
  },
  topLevel: {
    ...elevations.three,
    backgroundColor: colors.white,
    marginBottom: 16
  },
  level2: {
    ...elevations.two,
    backgroundColor: colors.white,
    marginLeft: 16,
    marginBottom: 16
  },
  level3: {
    ...elevations.one,
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
    ...elevations.four,
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

const mapStateToProps = state => {
  const user = state.managebac.overview.user;
  return { user };
};

export default connect(
  mapStateToProps,
  null
)(ManagebacMessageThreadScreen);
