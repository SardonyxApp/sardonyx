import React from 'react';

import {
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
  View
} from 'react-native';

export default class HeaderIcon extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    if (Platform.OS === 'ios') {
      return (
        <View
          style={{
            padding: 12
          }}
        >
          <TouchableOpacity
            onPress={this.props.onPress}
            style={{
              flex: 1
            }}
          >
            {this.props.children}
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View
          style={{
            height: 56,
            width: 42,
            flex: 1,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center'
          }}
        >
          <View
            style={{
              height: 32,
              width: 32,
              justifyContent: 'center'
            }}
          >
            <TouchableNativeFeedback
              delayPressIn={0}
              onPress={this.props.onPress}
              background={TouchableNativeFeedback.Ripple(
                'rgba(0, 0, 0, 0.32)',
                true
              )}
            >
              <View>{this.props.children}</View>
            </TouchableNativeFeedback>
          </View>
        </View>
      );
    }
  }
}
