import React from 'react';

import { View, StyleSheet, Dimensions, Text } from 'react-native';

import Lottie from 'lottie-react-native';
import { connect } from 'react-redux';

import { colors, fonts } from '../styles';

class GreetingsCard extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if(this.props.showOverviewAnimation) {
      setTimeout(() => {
        this.animation.play();
      }, 200);
    }
  }

  _getFirstName(text) {
    if (typeof text === 'string') return text.split(' ')[0];
    return text;
  }

  render() {
    return (
      <View style={greetingsCardStyles.container}>
        {this.props.showOverviewAnimation ? <Lottie
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
        /> : null}
        <Text style={greetingsCardStyles.title} numberOfLines={1}>
          Hello{' '}
          <Text style={greetingsCardStyles.name}>
            {this._getFirstName(this.props.name)}
          </Text>
        </Text>
      </View>
    );
  }
}

const greetingsCardStyles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    height: 200,
    backgroundColor: colors.blue,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    ...fonts.jost200,
    fontSize: 40,
    color: colors.white
  },
  name: {
    ...fonts.jost500
  }
});

const mapStateToProps = state => {
  const showOverviewAnimation = state.settings.general.showOverviewAnimation;
  return { showOverviewAnimation };
};

export default connect(mapStateToProps)(GreetingsCard);
