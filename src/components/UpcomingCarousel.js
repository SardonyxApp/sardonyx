import React from 'react';

import { View, Text, Dimensions, StyleSheet, Animated } from 'react-native';

import Carousel from 'react-native-snap-carousel';

import CalendarDate from '../components/CalendarDate';
import { colors, fonts, elevations } from '../styles';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

export default class UpcomingCarousel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      parsedData: [],
      completedLength: 0,
      upcomingLength: 0
    };

    this._parseData = this._parseData.bind(this);
    this._renderItem = this._renderItem.bind(this);
  }

  /**
   * Get the name of the class or group that the event is located in.
   * @param {String} link
   * @return {String}
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

  /**
   * Create a "Congratulations you have no tasks" card if there are no upcoming tasks.
   * In order to filter the past and future tasks, an "upcoming" key is added with a boolean.
   * @return {[Array, Integer, Integer]} Returns the array of all events, and the number of upcoming events.
   */
  _parseData() {
    let completedLength = this.props.completedEvents
      ? this.props.completedEvents.length
      : 0;
    let completedEvents = this.props.completedEvents || [];
    let upcomingLength = this.props.upcomingEvents
      ? this.props.upcomingEvents.length
      : 0;
    let upcomingEvents =
      !this.props.upcomingEvents || !this.props.upcomingEvents.length
        ? [
            {
              nothingToDo: true
            }
          ]
        : this.props.upcomingEvents;
    completedEvents.map(item => {
      item.upcoming = false;
      item.scale = new Animated.Value(1);
    });
    upcomingEvents.map(item => {
      item.upcoming = true;
      item.scale = new Animated.Value(1);
    });

    return [
      [...completedEvents, ...upcomingEvents],
      completedLength,
      upcomingLength
    ];
  }

  _onPressIn(item) {
    Animated.timing(item.scale, {
      toValue: 0.95,
      duration: 100,
      useNativeDriver: true
    }).start();
  }

  _onPressOut(item) {
    Animated.timing(item.scale, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true
    }).start();
  }

  /**
   * Return a View that contains a Carousel Card saying "Congratulations you have nothing to do"
   * Has quite a lot of inline styling.
   * @return {React.Component}
   */
  _renderNothingToDo() {
    return (
      <View style={upcomingCarouselStyles.wrapper}>
        <View
          style={[
            upcomingCarouselStyles.containerWrapper,
            {
              backgroundColor: colors.lightBlue2
            }
          ]}
        >
          <View style={upcomingCarouselStyles.container}>
            <View
              style={[
                upcomingCarouselStyles.textContainer,
                {
                  marginLeft: 14
                }
              ]}
            >
              <Text
                style={[
                  upcomingCarouselStyles.title,
                  {
                    flex: 0,
                    fontSize: 24,
                    color: colors.darkBlue
                  }
                ]}
              >
                Nothing!
              </Text>
              <Text
                style={[
                  upcomingCarouselStyles.subject,
                  {
                    fontSize: 12,
                    color: colors.blue
                  }
                ]}
              >
                There are no tasks/events coming up!
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  /**
   * Renders each View for the task Carousel.
   * @param {{Object}} item
   * @param {{Integer}} index
   * @return {React.Component}
   */
  _renderItem({ item, index }) {
    if (item.nothingToDo) return this._renderNothingToDo();
    return (
      <View style={upcomingCarouselStyles.wrapper}>
        <Animated.View
          style={[
            upcomingCarouselStyles.containerWrapper,
            !item.upcoming && {
              backgroundColor: colors.lightError2
            },
            {
              transform: [
                {
                  scale: item.scale
                }
              ]
            }
          ]}
        >
          <TouchableWithoutFeedback
            onPress={() => this._navigateToUpcomingEventScreen(item)}
            onPressIn={() => this._onPressIn(item)}
            onPressOut={() => this._onPressOut(item)}
          >
            <View style={upcomingCarouselStyles.container}>
              <CalendarDate
                date={new Date(Date.parse(item.due))}
                color={!item.upcoming && colors.error}
              />
              <View style={upcomingCarouselStyles.textContainer}>
                <Text
                  style={[
                    upcomingCarouselStyles.title,
                    !item.upcoming && {
                      color: colors.error
                    }
                  ]}
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
          </TouchableWithoutFeedback>
        </Animated.View>
      </View>
    );
  }

  // Let me just say that it took god damn ages to get this working, react-native-snap-carousel has
  // weird oddities where if you have a dynamic firstItem prop it doesn't re-render upon a change,
  // or if you use .snapToItem() inside a componentDidUpdate there has to be a delay because of how
  // it's built. The current method seems very much like a workaround but at least it works.
  componentDidUpdate(prevProps, prevState) {
    // Set the states only if the props are different. Omitting this check will result in a loop.
    if (
      this.props.completedEvents !== prevProps.completedEvents ||
      this.props.upcomingEvents !== prevProps.upcomingEvents
    ) {
      let [parsedData, completedLength, upcomingLength] = this._parseData();
      this.setState(
        {
          parsedData: parsedData,
          completedLength: completedLength,
          upcomingLength: upcomingLength
        },
        () => {
          setTimeout(() => {
            this._carousel.snapToItem(completedLength);
          }, 50);
        }
      );
    }
  }

  render() {
    return (
      <View style={upcomingCarouselStyles.carouselContainer}>
        <Carousel
          removeClippedSubviews={true}
          firstItem={this.state.completedLength}
          ref={c => {
            this._carousel = c;
          }}
          data={this.state.parsedData}
          renderItem={this._renderItem}
          sliderWidth={Dimensions.get('window').width}
          itemWidth={300}
          activeSlideAlignment={'start'}
          inactiveSlideScale={1}
          inactiveSlideOpacity={1}
          contentContainerCustomStyle={
            this.state.upcomingLength > 1
              ? {
                  overflow: 'hidden',
                  width: 300 * this.state.parsedData.length
                }
              : undefined
          }
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
    ...elevations.thirteen // Really increase this so the shadows appear blurry like iOS,
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
