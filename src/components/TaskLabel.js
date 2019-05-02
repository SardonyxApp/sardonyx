import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { Icon } from 'react-native-elements';
import { TouchableRipple } from 'react-native-paper';

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
 */
export default class TaskLabel extends React.PureComponent {
  render() {
    return (
      <TouchableRipple
        onPress={evt => {
          console.log(evt.target);
        }}
      >
        <View 
          className="label"
          color="white"
          style={[labelStyles.label, { backgroundColor: this.props.label.color }]} 
          key={this.props.label.name} // Don't use id because it duplicates 
          // onClick={props.updatable ? this.props.onUpdate : null}
        >
          <Text style={labelStyles.labelName}>{this.props.label.name}</Text>
          {this.props.removable 
          ? <Icon 
              size={12}
              color="white"
              name="close"
              type="material"
              containerStyle={labelStyles.icon}
              // onPress={evt => {
              //   evt.stopPropagation();
              //   props.onRemove(this.props.label.id);
              // }}
            />
          : null}
        </View>
      </TouchableRipple>
    );
  }
}

const labelStyles = StyleSheet.create({
  label: {
    marginHorizontal: 2,
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
    flexDirection: 'row'
  },
  labelName: {
    ...fonts.jost300,
    fontSize: 16,
    color: '#fff',
  },
  icon: {
    marginLeft: 4
  }
});