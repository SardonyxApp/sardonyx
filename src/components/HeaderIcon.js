import React from 'react';

import {
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
  View
} from 'react-native';

export default class HeaderIcon extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (Platform.OS === "ios") {
      return (
        <TouchableOpacity onPress={this.props.onPress}>
          {this.props.children}
        </TouchableOpacity>
      );
    } else {
      return (
        <View
          style={{
            height: 56,
            width: 56,
            flex: 1,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center"
          }}
        >
          <View
            style={{
              height: 32,
              width: 32,
              justifyContent: "center"
            }}
          >
            {/* <TouchableNativeFeedback
              delayPressIn={0}
              onPress={this.props.onPress}
              background={TouchableNativeFeedback.Ripple(
                "rgba(0, 0, 0, 0.32)",
                true
              )}
            >
              {this.props.children}
            </TouchableNativeFeedback> */}
            <TouchableOpacity
              onPress={this.props.onPress}
            >
              {this.props.children}
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  }
}