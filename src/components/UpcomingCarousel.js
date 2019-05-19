import React from 'react';

import { View, Text, Dimensions, StyleSheet } from 'react-native';

import Carousel from 'react-native-snap-carousel';
import { TouchableRipple } from 'react-native-paper';

import CalendarDate from '../components/CalendarDate';
import { colors, fonts } from '../styles';

export default class UpcomingCarousel extends React.Component {
  constructor(props) {
    super(props);

    this._renderItem = this._renderItem.bind(this);
  }

  /**
   * Get the name of the class or group that the event is located in.
   * @param {String} link
   */
  _getGroupClassName(link) {
    let groupClass = this.props.allGroupsAndClasses.find(item => {
      return link.includes(item.link.slice(0, -9)); // Remove the /overview bit
    });
    return groupClass ? decodeURI(groupClass.title) : 'IB Manager';
  }

  _navigateToUpcomingEventScreen(item) {
    this.props.navigation.navigate('UpcomingEventItem', {
      ...item,
      title: decodeURI(item.title),
      groupClassName: this._getGroupClassName(item.link)
    });
  }

  _renderItem({ item, index }) {
    return (
      <View style={upcomingCarouselStyles.wrapper}>
        <View
          style={[
            upcomingCarouselStyles.containerWrapper,
            !item.upcoming && {
              backgroundColor: colors.lightError2
            }
          ]}
        >
          <TouchableRipple
            onPress={() => this._navigateToUpcomingEventScreen(item)}
            rippleColor="rgba(0, 0, 0, .16)"
          >
            <View style={upcomingCarouselStyles.container}>
              <CalendarDate date={new Date(Date.parse(item.due))} color={!item.upcoming && colors.error} />
              <View style={upcomingCarouselStyles.textContainer}>
                <Text
                  style={[upcomingCarouselStyles.title, !item.upcoming && {
                    color: colors.error
                  }]}
                  ellipsizeMode={'tail'}
                >
                  {decodeURI(item.title)}
                </Text>
                <Text
                  style={upcomingCarouselStyles.subject}
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                >
                  {this._getGroupClassName(item.link)}
                </Text>
              </View>
            </View>
          </TouchableRipple>
        </View>
      </View>
    );
  }

  /**
   *
   */
  _parseData() {
    let completedEvents = this.props.completedEvents || [];
    let upcomingEvents = this.props.upcomingEvents || [];
    completedEvents.map(item => {
      item.upcoming = false;
    });
    upcomingEvents.map(item => {
      item.upcoming = true;
    });

    return [...completedEvents, ...upcomingEvents];
  }

  render() {
    const parsedData = this._parseData();
    return (
      <View style={upcomingCarouselStyles.carouselContainer}>
        <Carousel
          data={parsedData}
          renderItem={this._renderItem}
          sliderWidth={Dimensions.get('window').width}
          itemWidth={300}
          activeSlideAlignment={'start'}
          inactiveSlideScale={1}
          inactiveSlideOpacity={1}
          contentContainerCustomStyle={{
            overflow: 'hidden',
            width: 300 * parsedData.length
          }}
        />
      </View>
    );
  }
}

const upcomingCarouselStyles = StyleSheet.create({
  carouselContainer: {
    height: 150
  },
  wrapper: {
    paddingHorizontal: 16,
    paddingVertical: 25
  },
  containerWrapper: {
    backgroundColor: colors.white,
    height: 100,
    borderRadius: 4,
    elevation: 13 // Really increase this so the shadows appear blurry like iOS,
  },
  container: {
    flexDirection: 'row'
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
    marginVertical: 14,
    marginRight: 14
  },
  title: {
    ...fonts.jost400,
    fontSize: 16,
    flex: 1,
    flexWrap: 'wrap',
    flexShrink: 1
  },
  subject: {
    ...fonts.jost400,
    fontSize: 9,
    flexShrink: 1,
    bottom: 0
  }
});
