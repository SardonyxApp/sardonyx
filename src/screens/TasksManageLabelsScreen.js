import React from 'react';
import { ScrollView, Text, Alert, Platform, StatusBar } from 'react-native';

import { connect } from 'react-redux';

import { fonts, colors } from '../styles';
import Label from '../components/TasksLabel';

class TasksManageLabelsScreen extends React.Component {
  constructor(props) {
    super(props);

    this._handleUpdate = this._handleUpdate.bind(this);
    this._handleRemove = this._handleRemove.bind(this);
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Manage Labels'
    };
  };

  /**
   * Set the status bar color to brown.
   */
  _setStatusBar() {
    StatusBar.setBackgroundColor(colors.primary);
    StatusBar.setBarStyle('light-content');
  }

  componentDidMount() {
    Platform.OS === 'android' &&
      this.props.navigation.addListener('willFocus', this._setStatusBar);
  }

  _handleUpdate(type, obj) {
    this.props.navigation.state.params.onUpdate(type, obj);
  }

  _handleRemove(id) {
    Alert.alert(
      'Deletion Warning',
      'Once deleted, the label cannot be restored. Are you sure?',
      [
        {
          text: 'Cancel'
        },
        {
          text: 'OK',
          onPress: () => {
            this.props.navigation.state.params.onDelete(
              this.props.navigation.getParam('type'),
              id
            );
          }
        }
      ]
    );
  }

  render() {
    const labels = this.props[this.props.navigation.getParam('type')]
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(label => {
        return (
          <Label
            label={label}
            style={{
              paddingHorizontal: 24,
              paddingVertical: 12
            }}
            containerStyle={{
              marginVertical: 4
            }}
            updatable={true}
            onUpdate={() =>
              this.props.navigation.navigate('UpdateLabel', {
                onUpdate: this._handleUpdate,
                label,
                type: this.props.navigation.getParam('type')
              })
            }
            removable={true}
            onRemove={this._handleRemove}
            key={label.name}
          />
        );
      });

    if (!labels.length)
      labels.push(
        <Text key="no labels" style={{ ...fonts.jost400, fontSize: 18 }}>
          NO LABELS FOUND
        </Text>
      );

    return (
      <ScrollView
        style={{ flex: 1, backgroundColor: colors.lightBackground }}
        contentContainerStyle={{ paddingVertical: 4, paddingHorizontal: 12 }}
      >
        {labels}
      </ScrollView>
    );
  }
}

const mapStateToProps = state => {
  const subjects = state.labels.subjects;
  const categories = state.labels.categories;
  // Include both in props because navigation parameters are not accessible outside of the class
  return { subjects, categories };
};

export default connect(mapStateToProps)(TasksManageLabelsScreen);
