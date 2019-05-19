import React from 'react';

import { View, Text, Dimensions, StyleSheet } from 'react-native';

import Carousel from 'react-native-snap-carousel';
import { TouchableRipple } from 'react-native-paper';

import CalendarDate from '../components/CalendarDate';
import { colors, fonts } from '../styles';

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
    });
    upcomingEvents.map(item => {
      item.upcoming = true;
    });

    return [
      [...completedEvents, ...upcomingEvents],
      completedLength,
      upcomingLength
    ];
  }

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
                Congratulations!
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
                You have nothing to do!
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  _renderItem({ item, index }) {
    if (item.nothingToDo) return this._renderNothingToDo();
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
          </TouchableRipple>
        </View>
      </View>
    );
  }

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
            this.state.upcomingLength
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
