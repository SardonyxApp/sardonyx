import React from 'react';

import {
  View,
  ScrollView,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Dimensions,
  InteractionManager
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
      sending: false,
      textInputOffset: 0
    };
    this._onLayout = this._onLayout.bind(this);
    this._updateReflection = this._updateReflection.bind(this);
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Edit Reflection',
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

    InteractionManager.runAfterInteractions(() => {
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
    });
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
   * PATCH to /api/cas/:id/reflections/:id and go back upon success. Also call the onGoBack() function.
   */
  _updateReflection() {
    this.setState(
      {
        editable: false,
        sending: true // Maybe use this for loading animation? Currently used to check if draft message should be shown
      },
      async () => {
        const credentials = await Storage.retrieveCredentials();
        const response = await fetch(
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
        );

        if (this.props.navigation.getParam('onGoBack', null) !== null) {
          this.props.navigation.state.params.onGoBack();
        }
        this.props.navigation.goBack();
      }
    );
  }

  render() {
    return (
      <View style={updateReflectionStyles.flex1} onLayout={this._onLayout}>
        <KeyboardAvoidingView
          style={updateReflectionStyles.flex1}
          behavior={'padding'}
          keyboardVerticalOffset={this.state.textInputOffset}
        >
          <ScrollView keyboardDismissMode={'interactive'}>
            <TextInput
              style={updateReflectionStyles.textinput}
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

const updateReflectionStyles = StyleSheet.create({
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
