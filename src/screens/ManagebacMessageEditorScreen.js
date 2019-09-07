import React from 'react';

import {
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Dimensions,
  InteractionManager,
  Animated,
  Platform,
  StatusBar
} from 'react-native';

import { Icon } from 'react-native-elements';
import { TouchableRipple, Switch } from 'react-native-paper';
import TurndownService from '@bmewburn/turndown';
import { BASE_URL } from '../../env';

import HeaderIcon from '../components/HeaderIcon';
import { Storage } from '../helpers';
import { colors, fonts } from '../styles';

export default class ManagebacMessageEditorScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messageBodyValue: '',
      messageSubjectValue: '',
      editable: false,
      sending: false,
      textInputOffset: 0,
      notifyByEmail: false,
      privateMessage: false
    };
    this._onWillBlur = this._onWillBlur.bind(this);
    this._discardDraft = this._discardDraft.bind(this);
    this._saveDraft = this._saveDraft.bind(this);
    this._onLayout = this._onLayout.bind(this);
    this._sendMessage = this._sendMessage.bind(this);
  }

  sendingAnimation = new Animated.Value(0);

  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.state.params.editMode
        ? 'Edit Message'
        : 'Compose New Message',
      headerLeft: (
        <View style={{ height: 56, width: 56, alignItems: 'center' }}>
          <HeaderIcon
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Icon name="clear" color={colors.white} />
          </HeaderIcon>
        </View>
      ),
      headerRight: (
        <View style={{ height: 56, width: 42 }}>
          <Animated.View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              transform: [
                {
                  translateX:
                    navigation.state.params.sendingAnimationPosition || 0
                },
                {
                  rotate:
                    navigation.state.params.sendingAnimationRotation || '0deg'
                }
              ]
            }}
          >
            <HeaderIcon onPress={navigation.state.params.sendMessage}>
              {/** navigationOptions is static, so we have to use params to access a method */}
              <Icon
                name={navigation.state.params.editMode ? 'done' : 'send'}
                color={colors.white}
              />
            </HeaderIcon>
          </Animated.View>
        </View>
      )
    };
  };

  /**
   * Set the status bar color to blue.
   */
  _setStatusBar() {
    StatusBar.setBackgroundColor(colors.blue);
    StatusBar.setBarStyle('light-content');
  }

  componentDidMount() {
    Platform.OS === 'android' &&
      this.props.navigation.addListener('willFocus', this._setStatusBar);

    // Register the sendMessage method so it can be called from static navigationOptions
    this.props.navigation.setParams({
      sendMessage: this._sendMessage,
      sendingAnimationPosition: this.sendingAnimation.interpolate({
        inputRange: [0, 0.8, 1],
        outputRange: [0, -15, 45]
      }),
      sendingAnimationRotation: this.sendingAnimation.interpolate({
        inputRange: [0, 0.1, 0.3, 0.5, 0.7, 0.8],
        outputRange: ['0deg', '10deg', '-10deg', '10deg', '-10deg', '0deg'],
        extrapolate: 'clamp'
      })
    });

    // Wait until all transitions/animations complete until running
    InteractionManager.runAfterInteractions(async () => {
      const editMode = this.props.navigation.getParam('editMode', false);
      if (editMode) {
        const messageBodyHTML = this.props.navigation.state.params.data.content;
        const turndownService = new TurndownService();
        this.setState({
          messageSubjectValue: this.props.navigation.state.params.data.title,
          messageBodyValue: turndownService.turndown(messageBodyHTML)
        });
      } else {
        // Retrieve the draft if any exists, and set the value.
        let drafts = await Storage.retrieveValue('messageDrafts');
        if (drafts) {
          drafts = JSON.parse(drafts);
          if (this.props.navigation.getParam('id', null) in drafts) {
            this.setState({
              messageBodyValue:
                drafts[this.props.navigation.getParam('id', null)].value
            });
          }
        }

        // Register the willBlur event so we can save the draft upon closing
        this.props.navigation.addListener('willBlur', this._onWillBlur);
      }
      // Set the textinput as editable (https://github.com/facebook/react-native/issues/20887)
      setTimeout(() => {
        this.setState({
          editable: true
        });
      }, 100);
    });
  }

  /**
   * Remove the key/value pair for this CAS id draft in Storage (if it exists).
   */
  async _discardDraft() {
    let drafts = await Storage.retrieveValue('messageDrafts');
    if (!drafts) return;
    drafts = JSON.parse(drafts);
    delete drafts[this.props.navigation.getParam('id', null)];
    Storage.writeValue('messageDrafts', JSON.stringify(drafts)).catch(err => {
      console.warn(err);
    });
  }

  /**
   * Save the current value of the textbox to Storage under the CAS id key.
   */
  async _saveDraft() {
    let drafts = await Storage.retrieveValue('messageDrafts');
    if (!drafts) drafts = '{}';
    drafts = JSON.parse(drafts);
    drafts[this.props.navigation.state.params.id] = {
      value: this.state.messageBodyValue
    };
    Storage.writeValue('messageDrafts', JSON.stringify(drafts)).catch(err => {
      console.warn(err);
    });
  }

  _onWillBlur() {
    // Don't show the Save Draft dialog if the value is empty or has been sent already
    if (this.state.messageBodyValue !== '' && this.state.sending === false) {
      Alert.alert(
        '',
        'Save Draft?',
        [
          {
            text: 'Discard',
            onPress: this._discardDraft
          },
          {
            text: 'Save',
            onPress: this._saveDraft
          }
        ],
        {
          cancelable: false
        }
      );
    }
  }

  /**
   * Calculate the offset for the keyboard for the TextInput
   * @param {{{{ Integer }}}} height
   */
  _onLayout({
    nativeEvent: {
      layout: { height }
    }
  }) {
    const textInputOffset = Dimensions.get('window').height - height;
    this.setState({ textInputOffset });
  }

  /**
   * POST to /api/class|group/:id/messages and go back upon success. Also call the onGoBack() function.
   * If params.editMode is true, then PATCH to /api/class|group/:id/messages/messageId.
   */
  _sendMessage() {
    if (this.state.sending) return;
    Animated.timing(this.sendingAnimation, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true
    }).start();
    this.setState(
      {
        editable: false,
        sending: true // Maybe use this for loading animation? Currently used to check if draft message should be shown
      },
      async () => {
        const editMode = this.props.navigation.getParam('editMode', false);
        const url = editMode
          ? `${BASE_URL}${this.props.navigation.state.params.data.link}`
          : `${BASE_URL}/api/${this.props.navigation.state.params.type}/${this.props.navigation.state.params.id}/messages`;
        const credentials = await Storage.retrieveCredentials();
        await fetch(url, {
          method: editMode ? 'PATCH' : 'POST',
          headers: {
            'Login-Token': credentials,
            'Message-Data': JSON.stringify({
              topic: encodeURI(this.state.messageSubjectValue),
              body: encodeURI(this.state.messageBodyValue),
              notifyByEmail: editMode ? 0 : this.state.notifyByEmail,
              privateMessage: editMode ? 0 : this.state.privateMessage
            })
          },
          mode: 'no-cors'
        });
        // Remove the drafts if any exist
        this._discardDraft();
        if (this.props.navigation.getParam('onGoBack', null) !== null) {
          this.props.navigation.state.params.onGoBack();
        }
        this.props.navigation.goBack();
      }
    );
  }

  render() {
    return (
      <Animated.View style={newMessageStyles.flex1} onLayout={this._onLayout}>
        <KeyboardAvoidingView
          style={newMessageStyles.flex1}
          behavior={'padding'}
          keyboardVerticalOffset={this.state.textInputOffset}
        >
          <TextInput
            style={newMessageStyles.subjectTextInput}
            value={this.state.messageSubjectValue}
            onChangeText={messageSubjectValue =>
              this.setState({ messageSubjectValue })
            }
            editable={this.state.editable}
            autoFocus={true}
            textAlignVertical={'center'}
            selectionColor={colors.darkBlue}
            underlineColorAndroid={'rgba(0,0,0,0)'}
            placeholder={'Enter subject...'}
          />
          <ScrollView keyboardDismissMode={'interactive'}>
            {!this.props.navigation.getParam('editMode', false) && (
              <View style={newMessageStyles.optionsContainer}>
                <TouchableRipple
                  onPress={() => {
                    this.setState({
                      notifyByEmail: !this.state.notifyByEmail
                    });
                  }}
                >
                  <View style={newMessageStyles.options}>
                    <Text style={newMessageStyles.optionText}>
                      Notify by Email
                    </Text>
                    <View pointerEvents={'none'}>
                      <Switch
                        value={this.state.notifyByEmail}
                        color={colors.primary}
                      />
                    </View>
                  </View>
                </TouchableRipple>
                <TouchableRipple
                  onPress={() => {
                    this.setState({
                      privateMessage: !this.state.privateMessage
                    });
                  }}
                >
                  <View style={newMessageStyles.options}>
                    <Text style={newMessageStyles.optionText}>
                      Private Message
                    </Text>
                    <View pointerEvents={'none'}>
                      <Switch
                        value={this.state.privateMessage}
                        color={colors.primary}
                      />
                    </View>
                  </View>
                </TouchableRipple>
              </View>
            )}
            <TextInput
              style={newMessageStyles.bodyTextInput}
              value={this.state.messageBodyValue}
              onChangeText={messageBodyValue =>
                this.setState({ messageBodyValue })
              }
              editable={this.state.editable}
              multiline={true}
              blurOnSubmit={false}
              textAlignVertical={'top'}
              selectionColor={colors.darkBlue}
              underlineColorAndroid={'rgba(0,0,0,0)'}
              placeholder={'Start typing here... :)'}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </Animated.View>
    );
  }
}

const newMessageStyles = StyleSheet.create({
  flex1: {
    flex: 1,
    backgroundColor: colors.white,
    flexDirection: 'column'
  },
  optionsContainer: {
    backgroundColor: colors.lightBackground,
    borderBottomColor: colors.primary,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  options: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 4
  },
  optionText: {
    ...fonts.jost400
  },
  subjectTextInput: {
    fontSize: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.primary
  },
  bodyTextInput: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: colors.white
  }
});
