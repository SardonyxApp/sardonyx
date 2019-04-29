import React from 'react';

import { View, Text, Dimensions, StyleSheet } from 'react-native';

import Carousel from 'react-native-snap-carousel';
import { Icon } from 'react-native-elements';
import { TouchableRipple } from 'react-native-paper';

import { colors, fonts } from '../styles';

export default class ClassesCarousel extends React.Component {
  constructor(props) {
    super(props);

    this._renderItem = this._renderItem.bind(this);
  }

  _navigateToClassScreen(item) {
    this.props.navigation.navigate('ClassItem', {
      ...item,
      title: decodeURI(item.title)
    });
  }

  _renderItem({ item, index }) {
    return (
      <View style={classesCarouselStyles.wrapper}>
        <View style={classesCarouselStyles.containerWrapper}>
          <TouchableRipple
            onPress={() => this._navigateToClassScreen(item)}
            rippleColor="rgba(0, 0, 0, .16)"
          >
            <View style={classesCarouselStyles.container}>
              <Icon name="library-books" color={colors.white} />
            </View>
          </TouchableRipple>
        </View>
        <Text numberOfLines={1} style={classesCarouselStyles.text}>
          {decodeURI(item.title)}
        </Text>
      </View>
    );
  }

  render() {
    return (
      <View style={classesCarouselStyles.carouselContainer}>
        <Carousel
          data={this.props.classList}
          renderItem={this._renderItem}
          sliderWidth={Dimensions.get('window').width}
          itemWidth={100}
          enableSnap={false}
          enableMomentum={true}
          decelerationRate={0.9}
          activeSlideAlignment={'start'}
          inactiveSlideScale={1}
          inactiveSlideOpacity={1}
          contentContainerCustomStyle={{
            overflow: 'hidden',
            width: 100 * this.props.classList.length
          }}
        />
      </View>
    );
  }
}

const classesCarouselStyles = StyleSheet.create({
  carouselContainer: {
    height: 120
  },
  wrapper: {
    paddingHorizontal: 16,
    paddingVertical: 25
  },
  containerWrapper: {
    backgroundColor: '#00c2b5',
    height: 72,
    width: 72,
    borderRadius: 36,
    elevation: 2,
    overflow: 'hidden'
  },
  container: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    textAlign: 'center',
    marginTop: 4,
    fontSize: 12,
    ...fonts.jost400
  }
});
