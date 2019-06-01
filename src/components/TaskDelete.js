import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Icon } from 'react-native-elements';

import { styles, fonts } from '../styles';

export default class TaskDelete extends React.Component {
  constructor(props) {
    super(props);
    this._handleDelete = this._handleDelete.bind(this);
  }

  _handleDelete() {
    Alert.alert(
      'Deletion Warning',
      'Once the task is deleted, it cannot be restored. Are you sure?',
      [
        {
          text: 'Cancel'
        },
        {
          text: 'OK',
          onPress: () => {
            this.props.onDeleteTask(this.props.id);
            this.props.navigation.goBack();
          }
        }
      ]
    );    
  }

  render() {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 8
        }}
      >
        <Icon 
          name="delete"
          type="material"
          iconStyles={styles.icon}
          color="#f44138"
        />
        <TouchableOpacity
          onPress={this._handleDelete}
        >
          <Text
            style={{
              ...fonts.jost300,
              fontSize: 16,
              paddingHorizontal: 8,
              color: '#f44138'
            }}
          >
            Delete this task
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}