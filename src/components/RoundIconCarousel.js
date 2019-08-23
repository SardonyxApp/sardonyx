import React from 'react';

import { View, Text, Dimensions, StyleSheet } from 'react-native';

import Carousel from 'react-native-snap-carousel';
import { Icon } from 'react-native-elements';
import { TouchableRipple } from 'react-native-paper';

import { colors, fonts, elevations } from '../styles';

export default class RoundIconCarousel extends React.PureComponent {
  constructor(props) {
    super(props);

    this._renderItem = this._renderItem.bind(this);
  }

  _renderItem({ item }) {
    return <RoundIcon {...this.props} data={item} />;
  }

  render() {
    return (
      <View style={classesCarouselStyles.carouselContainer}>
        <Carousel
          data={this.props.list}
          renderItem={this._renderItem}
          sliderWidth={Dimensions.get('window').width}
          itemWidth={100}
          enableSnap={false}
          enableMomentum={true}
          decelerationRate={0.99}
          activeSlideAlignment={'start'}
          inactiveSlideScale={1}
          inactiveSlideOpacity={1}
          contentContainerCustomStyle={{
            overflow: 'hidden',
            width: 100 * this.props.list.length
          }}
        />
      </View>
    );
  }
}

class RoundIcon extends React.PureComponent {
  constructor(props) {
    super(props);

    this._navigateToItemScreen = this._navigateToItemScreen.bind(this);
  }

  _navigateToItemScreen() {
    const screenName =
      this.props.type.charAt(0).toUpperCase() +
      this.props.type.slice(1) +
      'Item';
    this.props.navigation.navigate(screenName, {
      ...this.props.data,
      title: decodeURI(this.props.data.title)
    });
  }

  render() {
    return (
      <View style={classesCarouselStyles.wrapper}>
        <View
          style={[
            classesCarouselStyles.containerWrapper,
            this.props.color && {
              borderColor: this.props.color
            }
          ]}
        >
          <TouchableRipple
            onPress={this._navigateToItemScreen}
            rippleColor="rgba(0, 0, 0, .16)"
          >
            <View style={classesCarouselStyles.container}>
              <View
                style={[
                  classesCarouselStyles.letterContainer,
                  StyleSheet.absoluteFillObject
                ]}
              >
                <Text style={classesCarouselStyles.letter}>
                  {decodeURI(this.props.data.title)[0]}
                </Text>
              </View>
              <View style={classesCarouselStyles.iconContainer}>
                <Icon
                  name={
                    this.props.type === 'class' ? 'library-books' : 'people'
                  }
                  color={colors.darkPrimary}
                  size={16}
                  style={classesCarouselStyles.icon}
                />
              </View>
            </View>
          </TouchableRipple>
        </View>
        <Text numberOfLines={1} style={classesCarouselStyles.text}>
          {decodeURI(this.props.data.title)}
        </Text>
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
    backgroundColor: colors.white,
    height: 72,
    width: 72,
    borderRadius: 36,
    ...elevations.two,
    overflow: 'hidden',
    borderWidth: 4
  },
  container: {
    width: 72 - 8,
    height: 72 - 8
  },
  letterContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  letter: {
    fontSize: 24,
    ...fonts.jost500,
    color: colors.darkPrimary
  },
  iconContainer: {
    backgroundColor: colors.white,
    borderRadius: 4,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: ((72 - 8) / 2),
    left: ((72 - 8) / 2)
  },
  text: {
    textAlign: 'center',
    marginTop: 4,
    fontSize: 12,
    ...fonts.jost400
  }
});
