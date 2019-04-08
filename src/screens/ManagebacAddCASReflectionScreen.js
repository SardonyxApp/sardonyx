import React from 'react';

import { View, TextInput, StyleSheet, Alert } from 'react-native';

import { Storage } from '../helpers';
import { colors } from '../styles';

export default class ManagebacAddCASReflectionScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reflectionValue: '',
      editable: false
    };
    this._onWillBlur = this._onWillBlur.bind(this);
    this._discardDraft = this._discardDraft.bind(this);
    this._saveDraft = this._saveDraft.bind(this);
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Write New Reflection'
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
    if (this.state.reflectionValue !== '') {
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
    this.props.navigation.addListener('willBlur', this._onWillBlur);
    setTimeout(() => {
      this.setState({
        editable: true
      });
    }, 100);
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
