import React from 'react';

import { View, Image, StyleSheet } from 'react-native';

import { colors } from '../styles';

export default class PreloadImage extends React.PureComponent {
  isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      width: null,
      height: null
    };
    this._requestSize = this._requestSize.bind(this);
  }

  componentWillMount() {
    this._requestSize();
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentDidUpdate() {
    this._requestSize();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  /**
   * Send a request to get the image size, and resize as necessary.
   */
  _requestSize() {
    Image.getSize(
      this.props.sourceUri,
      (width, height) => {
        if (!this._isMounted) return;
        if (this.props.style.width && this.props.style.height) {
          width = this.props.style.width;
          height = this.props.style.height;
        } else if (this.props.style.width) {
          height = (this.props.style.width / width) * height;
          width = this.props.style.width;
        } else if (this.props.style.height) {
          width = (this.props.style.height / height) * width;
          height = this.props.style.height;
        }
        this.setState({
          width,
          height
        });
      },
      error => {
        console.warn(error);
      }
    );
  }

  render() {
    return (
      <View style={preloadImageStyles.container}>
        <Image
          {...this.props}
          source={{ uri: this.props.sourceUri }}
          style={[
            this.props.style,
            {
              height: this.state.height,
              width: this.state.width
            }
          ]}
        />
      </View>
    );
  }
}

const preloadImageStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.gray1
  }
});
