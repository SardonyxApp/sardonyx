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
      reflectionValue: '',
      editable: false,
      sending: false,
      textInputOffset: 0
    };
    this._onWillBlur = this._onWillBlur.bind(this);
    this._discardDraft = this._discardDraft.bind(this);
    this._saveDraft = this._saveDraft.bind(this);
    this._onLayout = this._onLayout.bind(this);
    this._sendReflection = this._sendReflection.bind(this);
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Write New Reflection',
      headerLeft: (
        <HeaderIcon
          onPress={() => {
            navigation.goBack();
          }}
        >
          {/**TODO: Check if using a custom Icon component here affects iOS rendering */}
          <Icon name="clear" color={colors.white} />
        </HeaderIcon>
      ),
      headerRight: (
        <HeaderIcon onPress={navigation.state.params.sendReflection}>
          {/** navigationOptions is static, so we have to use params to access a method */}
          <Icon name="send" color={colors.white} />
        </HeaderIcon>
      )
    };
  };

  componentDidMount() {
    // Register the sendReflection method so it can be called from static navigationOptions
    this.props.navigation.setParams({ sendReflection: this._sendReflection });

    // Wait until all transitions/animations complete until running
    InteractionManager.runAfterInteractions(async () => {
      // Retrieve the draft is any exists, and set the value.
      let drafts = await Storage.retrieveValue('reflectionDrafts');
      if (drafts) {
        drafts = JSON.parse(drafts);
        if (this.props.navigation.getParam('id', null) in drafts) {
          this.setState({
            reflectionValue:
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
    let drafts = await Storage.retrieveValue('reflectionDrafts')
    if (!drafts) return;
    drafts = JSON.parse(drafts);
    delete drafts[this.props.navigation.getParam('id', null)];
    Storage.writeValue('reflectionDrafts', JSON.stringify(drafts)).catch(
      err => {
        console.warn(err);
      }
    );
  }

  /**
   * Save the current value of the textbox to Storage under the CAS id key.
   */
  async _saveDraft() {
    let drafts = await Storage.retrieveValue('reflectionDrafts');
    if (!drafts) drafts = '{}';
    drafts = JSON.parse(drafts);
    drafts[this.props.navigation.state.params.id] = {
      value: this.state.reflectionValue
    };
    Storage.writeValue('reflectionDrafts', JSON.stringify(drafts)).catch(
      err => {
        console.warn(err);
      }
    );
  }

  _onWillBlur() {
    // Don't show the Save Draft dialog if the value is empty or has been sent already
    if (this.state.reflectionValue !== '' && this.state.sending === false) {
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
   * POST to /api/cas/:id/reflections and go back upon success. Also call the onGoBack() function.
   */
  _sendReflection() {
    this.setState(
      {
        editable: false,
        sending: true // Maybe use this for loading animation? Currently used to check if draft message should be shown
      },
      async () => {
        const credentials = await Storage.retrieveCredentials();
        await fetch(
          `${BASE_URL}/api/cas/${
            this.props.navigation.state.params.id
          }/reflections`,
          {
            method: 'POST',
            headers: {
              'Login-Token': credentials,
              'Reflection-Data': JSON.stringify({
                body: encodeURI(this.state.reflectionValue)
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
      <View style={addReflectionStyles.flex1} onLayout={this._onLayout}>
        <KeyboardAvoidingView
          style={addReflectionStyles.flex1}
          behavior={'padding'}
          keyboardVerticalOffset={this.state.textInputOffset}
        >
          <ScrollView keyboardDismissMode={'interactive'}>
            <TextInput
              style={addReflectionStyles.textinput}
              value={this.state.reflectionValue}
              onChangeText={reflectionValue =>
                this.setState({ reflectionValue })
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

const addReflectionStyles = StyleSheet.create({
  flex1: {
    flex: 1,
    backgroundColor: colors.white
  },
  textinput: {
    flex: 1,
    marginTop: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: colors.white
  }
});
