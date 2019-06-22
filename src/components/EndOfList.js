import React from 'react';

import { View, Image, StyleSheet, Dimensions } from 'react-native';

export default class EndOfList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Image
        style={endOfListStyles.image}
        source={require('../assets/endOfList.png')}
        resizeMode="contain"
      />
    );
  }
}

const endOfListStyles = StyleSheet.create({
  image: {
    height: (Dimensions.get('window').width / 768) * 270,
    width: Dimensions.get('window').width
  }
});
