import React from 'react';

import { View, Text, StyleSheet } from 'react-native';

import { TouchableRipple } from 'react-native-paper';
import { Icon } from 'react-native-elements';
import { fonts, colors } from '../styles';

export default class ExpandableCard extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    }
    this._toggleCard = this._toggleCard.bind(this);
  }

  /**
   * Toggle the card's expanded state.
   */
  _toggleCard() {
    this.setState({
      expanded: !this.state.expanded
    });
  }

  /**
   * Function called when rendering the expanded part of the card. 
   * This is overridden by the child classes.
   */
  _renderList() {}

  render() {
    return (
      <View style={cardStyles.card}>
        <TouchableRipple onPress={this._toggleCard} rippleColor="rgba(0, 0, 0, .16)">
          <View style={cardStyles.title}>
            <Text style={cardStyles.titleText}>{this.props.title}</Text>
            <Icon style={cardStyles.titleIcon} name={
              this.state.expanded ? "expand-less" : "expand-more"
             } color={colors.blue} onPress={this._toggleCard}/>
          </View>
        </TouchableRipple>
        <View style={[cardStyles.list, this.state.expanded ? cardStyles.shown : cardStyles.hidden]}>
          {this._renderList()}
        </View>
      </View>
    )
  }
}

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    marginTop: 16,
    marginHorizontal: 24,
    borderColor: colors.gray1,
    borderWidth: 1,
    borderRadius: 4,
    overflow: 'hidden'
  },
  hidden: {
    height: 0
  },
  shown: {

  },
  title: {
    marginHorizontal: 24,
    marginVertical: 12,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  titleText: {
    flex: 1,
    ...fonts.jost300,
    fontSize: 14
  },
  titleIcon: {
    width: 24
  }
})