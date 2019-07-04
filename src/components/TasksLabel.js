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
 * @param {Boolean} props.removable if true, onRemove will be triggered when clicked on RemoveIcon
 * @param {Styles} props.style
 */
export default class TasksLabel extends React.PureComponent {
  render() {
    return (
      <View style={labelStyles.container}>
        <View
          style={{
            backgroundColor: this.props.label.color,
            borderRadius: this.props.radius || 1000
          }}
        >
          <TouchableRipple
            onPress={this.props.updatable ? this.props.onUpdate : null}
          >
            <View style={[labelStyles.label, this.props.style]}>
              <Text style={labelStyles.labelName}>{this.props.label.name}</Text>
              {this.props.removable ? (
                <Icon
                  size={20}
                  color="white"
                  name="close"
                  type="material"
                  containerStyle={labelStyles.icon}
                  onPress={() => this.props.onRemove(this.props.label.id)}
                />
              ) : null}
            </View>
          </TouchableRipple>
        </View>
      </View>
    );
  }
}

const labelStyles = StyleSheet.create({
  container: {
    marginHorizontal: 2,
    marginVertical: 2
  },
  label: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center'
  },
  labelName: {
    ...fonts.jost300,
    fontSize: 16,
    color: '#fff',
    flex: 1
  },
  icon: {
    marginLeft: 4
  }
});
