import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { Chip } from 'react-native-paper';

import { fonts } from '../styles';

/**
 * @param {Object} props
 * @param {Object} props.label
 * @param {Object} props.label.id required if updatable or removable
 * @param {Object} props.label.name required
 * @param {Object} props.label.color required
 * @param {Function} props.onUpdate passed id
 * @param {Function} props.onRemove passed id
 * @param {Boolean} props.updatable if true, onUpdate will be triggered when clicked on the body
 * @param {Bololean} props.removable if true, onRemove will be triggered when clicked on RemoveIcon
 * @param {Styles} props.style
 */
export default class TasksLabel extends React.PureComponent {
  render() {
    return (
      <Chip
        style={[
          labelStyles.label,
          {
            backgroundColor: this.props.label.color
          }
        ]}
        mode={'outlined'}
        selectedColor={this.props.label.color}
        onClose={
          this.props.removable && this.props.onRemove
            ? this.props.onRemove
            : null
        }
        onPress={
          this.props.updatable && this.props.onUpdate
            ? this.props.onUpdate
            : null
        }
        {...this.props}
      >
        {this.props.label.name}
      </Chip>
    );
  }
}

const labelStyles = StyleSheet.create({
  label: {
    marginHorizontal: 2,
    color: '#fff'
  }
});
