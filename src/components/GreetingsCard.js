import React from 'react';

import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  Image,
  TouchableOpacity,
  Platform
} from 'react-native';

import { Icon } from 'react-native-elements';
import Lottie from 'lottie-react-native';
import { connect } from 'react-redux';
import moment from 'moment';

import NotificationBadge from './NotificationBadge';
import { colors, fonts } from '../styles';

class GreetingsCard extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      timeOfDay: 'morning'
    };
  }

  componentDidMount() {
    this.setState({
      timeOfDay: this._setTimeOfDay(moment())
    });
  }

  _setTimeOfDay(time) {
    if (!time || !time.isValid()) return;
    const morningBegins = 5;
    const lunchBegins = 11;
    const afternoonBegins = 14;
    const eveningBegins = 19;
    const nightBegins = 0;
    const currentHour = parseFloat(time.format('HH'));

    if (currentHour >= nightBegins && currentHour < morningBegins) {
      // 0:00 - 04:59
      return 'night';
    } else if (currentHour >= morningBegins && currentHour < lunchBegins) {
      // 05:00 - 10:59
      return 'morning';
    } else if (currentHour >= lunchBegins && currentHour < afternoonBegins) {
      // 11:00 - 13:59
      return 'lunch';
    } else if (currentHour >= afternoonBegins && currentHour < eveningBegins) {
      // 14:00 - 18:59
      return 'afternoon';
    } else {
      // 19:00 - 24:00
      return 'evening';
    }
  }

  _getGreeting() {
    switch (this.state.timeOfDay) {
      case 'morning':
        return 'Good morning,';
      case 'lunch':
        return 'Hello,';
      case 'afternoon':
        return 'Good afternoon,';
      case 'evening':
        return 'Good evening,';
      case 'night':
        return 'Better sleep soon,';
      default:
        return 'Hello,';
    }
  }

  _getFirstName(text) {
    if (typeof text === 'string') return text.split(' ')[0];
    return text;
  }

  render() {
    return (
      <View style={greetingsCardStyles.container}>
        {(this.state.timeOfDay === 'morning' ||
          this.state.timeOfDay === 'afternoon') &&
        Platform.OS === 'android' &&
        this.props.showOverviewAnimation ? (
          <Lottie
            style={greetingsCardStyles.image}
            ref={animation => {
              this.animation = animation;
            }}
            loop={true}
            autoPlay={this.props.showOverviewAnimation}
            source={require('../assets/logos/fumikiri.json')}
          />
        ) : (
          <Image
            source={require('../assets/logos/school.png')}
            style={greetingsCardStyles.image}
          />
        )}
        <Text style={greetingsCardStyles.title} numberOfLines={1}>
          {this._getGreeting()}
        </Text>
        <Text style={greetingsCardStyles.name}>
          {this._getFirstName(this.props.name)}
        </Text>
        <TouchableOpacity
          style={greetingsCardStyles.notificationIcon}
          onPress={() => {
            this.props.navigation.navigate('Alerts', {
              refreshPage: this.props.navigation.state.params.refreshPage
            });
          }}
        >
          <NotificationBadge style={{ position: 'relative' }}/>
          <Icon
            name={
              this.props.notificationCount
                ? 'notifications-active'
                : 'notifications-none'
            }
            color={colors.primary}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const greetingsCardStyles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    height: (Dimensions.get('window').width / 36) * 20,
    backgroundColor: colors.white,
    flex: 1
  },
  image: {
    width: Dimensions.get('window').width,
    height: (Dimensions.get('window').width / 36) * 25,
    position: 'absolute',
    bottom: 0
  },
  title: {
    marginTop: 28,
    paddingHorizontal: 16,
    ...fonts.jost400,
    fontSize: 24,
    color: colors.lightPrimary
  },
  name: {
    marginTop: -12,
    paddingHorizontal: 16,
    ...fonts.jost500,
    fontSize: 56,
    color: colors.darkPrimary2
  },
  notificationIcon: {
    position: 'absolute',
    top: 16,
    right: 8,
    height: 24,
    flexDirection: 'row',
    alignItems: 'center'
  }
});

const mapStateToProps = state => {
  const showOverviewAnimation = state.settings.general.showOverviewAnimation;
  return { showOverviewAnimation };
};

export default connect(mapStateToProps)(GreetingsCard);
