import React from 'react';

import {
  KeyboardAvoidingView,
  TextInput,
  StyleSheet,
  Alert
} from 'react-native';

import { Icon } from 'react-native-elements';
import TurndownService from '@bmewburn/turndown';
import { BASE_URL } from '../../env';

import HeaderIcon from '../components/HeaderIcon';
import { Storage } from '../helpers';
import { colors } from '../styles';

export default class ManagebacEditCASReflectionScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reflectionValue: '',
      editable: false,
      sending: false
    };
    this._updateReflection = this._updateReflection.bind(this);
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Edit Reflection',
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
        <HeaderIcon onPress={navigation.state.params.updateReflection}>
          {/** navigationOptions is static, so we have to use params to access a method */}
          <Icon name="done" color={colors.white} />
        </HeaderIcon>
      )
    };
  };

  componentDidMount() {
    // Register the sendReflection method so it can be called from static navigationOptions
    this.props.navigation.setParams({
      updateReflection: this._updateReflection
    });

    const currentValueHTML = this.props.navigation.getParam(
      'currentValueHTML',
      ''
    );
    const turndownService = new TurndownService();
    this.setState({
      reflectionValue: turndownService.turndown(currentValueHTML)
    });

    // Set the textinput as editable (https://github.com/facebook/react-native/issues/20887)
    setTimeout(() => {
      this.setState({
        editable: true
      });
    }, 100);
  }

  /**
   * PATCH to /api/cas/:id/reflections/:id and go back upon success. Also call the onGoBack() function.
   */
  _updateReflection() {
    this.setState(
      {
        editable: false,
        sending: true // Maybe use this for loading animation? Currently used to check if draft message should be shown
      },
      () => {
        Storage.retrieveCredentials()
          .then(credentials => {
            fetch(
              `${BASE_URL}/api/cas/${
                this.props.navigation.state.params.id
              }/reflections/${this.props.navigation.state.params.reflectionId}`,
              {
                method: 'PATCH',
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
                if (this.props.navigation.getParam('onGoBack', null) !== null) {
                  this.props.navigation.state.params.onGoBack();
                }
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
      <KeyboardAvoidingView behavior="padding">
        <TextInput
          style={updateReflectionStyles.textinput}
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
          textAlignVertical="top"
          selectionColor={colors.black}
          underlineColorAndroid={'rgba(0,0,0,0)'}
        />
      </KeyboardAvoidingView>
    );
  }
}

const updateReflectionStyles = StyleSheet.create({
  textinput: {
    marginTop: 16,
    paddingVertical: 16,
    paddingHorizontal: 8,
    fontSize: 16,
    backgroundColor: colors.lightPrimary2
  }
});
