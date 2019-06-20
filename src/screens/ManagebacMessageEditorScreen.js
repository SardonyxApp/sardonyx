import React from 'react';

import {
  View,
  ScrollView,
  TextInput,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Dimensions,
  InteractionManager
} from 'react-native';

import { Icon } from 'react-native-elements';
import { BASE_URL } from '../../env';

import HeaderIcon from '../components/HeaderIcon';
import { Storage } from '../helpers';
import { colors } from '../styles';

export default class ManagebacAddCASReflectionScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messageBodyValue: '',
      messageSubjectValue: '',
      editable: false,
      sending: false,
      textInputOffset: 0
    };
    this._onWillBlur = this._onWillBlur.bind(this);
    this._discardDraft = this._discardDraft.bind(this);
    this._saveDraft = this._saveDraft.bind(this);
    this._onLayout = this._onLayout.bind(this);
    this._sendMessage = this._sendMessage.bind(this);
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Compose New Message',
      headerLeft: (
        <HeaderIcon
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Icon name="clear" color={colors.white} />
        </HeaderIcon>
      ),
      headerRight: (
        <HeaderIcon onPress={navigation.state.params.sendMessage}>
          {/** navigationOptions is static, so we have to use params to access a method */}
          <Icon name="send" color={colors.white} />
        </HeaderIcon>
      )
    };
  };

  componentDidMount() {
    // Register the sendMessage method so it can be called from static navigationOptions
    this.props.navigation.setParams({ sendMessage: this._sendMessage });

    // Wait until all transitions/animations complete until running
    InteractionManager.runAfterInteractions(async () => {
      // Retrieve the draft is any exists, and set the value.
      const drafts = await Storage.retrieveValue('messageDrafts');
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
    const drafts = await Storage.retrieveValue('messageDrafts');
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
    const drafts = await Storage.retrieveValue('messageDrafts');
    if (!drafts) drafts = '{}';
    drafts = JSON.parse(drafts);
    drafts[this.props.navigation.state.params.id] = {
      value: this.state.messageBodyValue
    };
    Storage.writeValue('reflectionDrafts', JSON.stringify(drafts)).catch(
      err => {
        console.warn(err);
      }
    );
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
   */
  _sendMessage() {
    this.setState(
      {
        editable: false,
        sending: true // Maybe use this for loading animation? Currently used to check if draft message should be shown
      },
      async () => {
        const credentials = await Storage.retrieveCredentials();
        console.log(this.state);
        await fetch(
          `${BASE_URL}/api/${this.props.navigation.state.params.type}/${
            this.props.navigation.state.params.id
          }/messages`,
          {
            method: 'POST',
            headers: {
              'Login-Token': credentials,
              'Reflection-Data': JSON.stringify({
                topic: encodeURI(this.state.messageSubjectValue),
                body: encodeURI(this.state.messageBodyValue),
                notifyByEmail: 0,
                privateMessage: 0
              })
            },
            mode: 'no-cors'
          }
        );
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
      <View style={newMessageStyles.flex1} onLayout={this._onLayout}>
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
            <TextInput
              style={newMessageStyles.bodyTextInput}
              value={this.state.messageBodyValue}
              onChangeText={messageBodyValue =>
                this.setState({ messageBodyValue })
              }
              editable={this.state.editable}
              multiline={true}
              blurOnSubmit={false}
              autoFocus={true}
              textAlignVertical={'top'}
              selectionColor={colors.darkBlue}
              underlineColorAndroid={'rgba(0,0,0,0)'}
              placeholder={'Start typing here... :)'}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const newMessageStyles = StyleSheet.create({
  flex1: {
    flex: 1,
    backgroundColor: colors.lightPrimary2,
    flexDirection: 'column'
  },
  subjectTextInput: {
    fontSize: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary
  },
  bodyTextInput: {
    flex: 1,
    marginTop: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: colors.lightPrimary2
  }
});
