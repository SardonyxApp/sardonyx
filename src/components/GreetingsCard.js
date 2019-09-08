import React from 'react';

import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  Image,
  TouchableOpacity
} from 'react-native';

import Lottie from 'lottie-react-native';
import { connect } from 'react-redux';

import NotificationBadge from './NotificationBadge';
import { Icon } from 'react-native-elements';

import { colors, fonts } from '../styles';

class GreetingsCard extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (this.props.showOverviewAnimation) {
      setTimeout(() => {
        this.animation.play();
      }, 100);
    }
  }

  _getGreeting(time) {

  } 

  _getFirstName(text) {
    if (typeof text === 'string') return text.split(' ')[0];
    return text;
  }

  render() {
    return (
      <View style={greetingsCardStyles.container}>
        {/* {this.props.showOverviewAnimation ? <Lottie
          style={{
            width: Dimensions.get('window').width,
            height: (Dimensions.get('window').width / 1080) * 300,
            position: 'absolute',
            bottom: 0
          }}
          ref={animation => {
            this.animation = animation;
          }}
          loop={true}
          autoPlay={this.props.showOverviewAnimation}
          source={require('../assets/overview.json')}
        /> : null} */}
        <Image
          source={require('../assets/logos/school.png')}
          style={{
            width: Dimensions.get('window').width,
            height: (Dimensions.get('window').width / 36) * 25,
            position: 'absolute',
            bottom: 0
          }}
        />
        <Text style={greetingsCardStyles.title} numberOfLines={1}>
          Good Morning,
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
          <Icon
            name={
              this.props.notificationCount
                ? 'notifications-active'
                : 'notifications-none'
            }
            color={colors.primary}
          />
          <NotificationBadge />
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
    right: 8
  }
});

const mapStateToProps = state => {
  const showOverviewAnimation = state.settings.general.showOverviewAnimation;
  return { showOverviewAnimation };
};

export default connect(mapStateToProps)(GreetingsCard);
