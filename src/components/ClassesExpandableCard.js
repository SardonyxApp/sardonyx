import React from 'react';

import { FlatList } from 'react-native';

import { List, TouchableRipple } from 'react-native-paper';
import ExpandableCard from './ExpandableCard';

export default class ClassesExpandableCard extends ExpandableCard {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    };
    this._navigateToClassScreen = this._navigateToClassScreen.bind(this);
  }

  _navigateToClassScreen(item) {
    this.props.navigation.navigate('ClassItem', {
      ...item,
      title: decodeURI(item.title)
    });
  }

  _renderList() {
    return (
      <FlatList
        data={this.props.classList}
        keyExtractor={item => item.link}
        renderItem={({ item }) => (
          <TouchableRipple
            onPress={() => this._navigateToClassScreen(item)}
            rippleColor="rgba(0, 0, 0, .16)"
          >
            <List.Item
              left={props => <List.Icon {...props} icon="library-books" />}
              title={decodeURI(item.title)}
            />
          </TouchableRipple>
        )}
      />
    );
  }
}
