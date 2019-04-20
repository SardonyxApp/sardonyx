import React from 'react';

import { View, TextInput, StyleSheet, Alert } from 'react-native';

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
      sending: false
    };
    this._onWillBlur = this._onWillBlur.bind(this);
    this._discardDraft = this._discardDraft.bind(this);
    this._saveDraft = this._saveDraft.bind(this);
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

  _discardDraft() {
    Storage.retrieveValue('reflectionDrafts')
      .then(drafts => {
        if (!drafts) return;
        drafts = JSON.parse(drafts);
        delete drafts[this.props.navigation.getParam('id', null)];
        Storage.writeValue('reflectionDrafts', JSON.stringify(drafts)).catch(
          err => {
            console.warn(err);
          }
        );
      })
      .catch(err => {
        console.warn(err);
      });
  }

  _saveDraft() {
    Storage.retrieveValue('reflectionDrafts')
      .then(drafts => {
        if (!drafts) drafts = '{}';
        drafts = JSON.parse(drafts);
        drafts[this.props.navigation.getParam('id', null)] = {
          value: this.state.reflectionValue
        };
        Storage.writeValue('reflectionDrafts', JSON.stringify(drafts)).catch(
          err => {
            console.warn(err);
          }
        );
      })
      .catch(err => {
        console.warn(err);
      });
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

  componentDidMount() {
    // Register the sendReflection method so it can be called from static navigationOptions
    this.props.navigation.setParams({ sendReflection: this._sendReflection });

    // Retrieve the draft is any exists, and set the value.
    Storage.retrieveValue('reflectionDrafts')
      .then(drafts => {
        if (!drafts) return;
        drafts = JSON.parse(drafts);
        if (this.props.navigation.getParam('id', null) in drafts) {
          this.setState({
            reflectionValue:
              drafts[this.props.navigation.getParam('id', null)].value
          });
        }
      })
      .catch(err => {
        console.warn(err);
      });

    // Register the willBlur event so we can save the draft upon closing
    this.props.navigation.addListener('willBlur', this._onWillBlur);

    // Set the textinput as editable (https://github.com/facebook/react-native/issues/20887)
    setTimeout(() => {
      this.setState({
        editable: true
      });
    }, 100);
  }

  _sendReflection() {
    this.setState(
      {
        editable: false,
        sending: true // Maybe use this for loading animation? Currently used to check if draft message should be shown
      },
      () => {
        Storage.retrieveCredentials()
          .then(credentials => {
            fetch(
              `${BASE_URL}/api/cas/${this.props.navigation.getParam(
                'id',
                null
              )}/reflections`,
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
            )
              .then(response => {
                // Remove the drafts if any exist
                this._discardDraft();
                this.props.navigation.goBack();
              })
              .catch(err => {
                console.log(err);
              });
          })
          .catch(err => {
            console.warn(err);
          });
      }
    );
  }

  render() {
    return (
      <View>
        <TextInput
          style={addReflectionStyles.textinput}
          value={this.state.reflectionValue}
          returnKeyType="next"
          autoCapitalize="sentences"
          onChangeText={text =>
            this.setState({
              reflectionValue: text
            })
          }
          editable={this.state.editable}
          blurOnSubmit={false}
          multiline={true}
          autoFocus={true}
          textAlignVertical={'top'}
          selectionColor={colors.black}
          underlineColorAndroid={'rgba(0,0,0,0)'}
        />
      </View>
    );
  }
}

const addReflectionStyles = StyleSheet.create({
  textinput: {
    marginTop: 16,
    paddingVertical: 16,
    paddingHorizontal: 8,
    fontSize: 16,
    backgroundColor: colors.lightPrimary2
  }
});
