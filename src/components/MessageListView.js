import React from 'react';

import { Text, View, FlatList, StyleSheet, Image } from 'react-native';

import { DangerZone } from 'expo';
const { Lottie } = DangerZone;
import HTMLView from 'react-native-htmlview';

import { fonts } from '../styles';

export default class MessageListView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: []
    };

    this._renderMessage = this._renderMessage.bind(this);
  }

  componentDidMount() {
    // For some reason this.animation.play() doesn't work when immediately called
    // Weird, because it works in LoginCheckScreen
    setTimeout(() => {
      this.animation.play();
    }, 50);
  }

  /**
   * Render each message in its own row.
   * @param {{ Object, Integer }}
   * @return {React.Component}
   */
  _renderMessage({ item, index }) {
    return (
      <View style={messageListStyles.messageContainer}>
        <View style={messageListStyles.imageContainer}>
          <Image
            source={
              item.avatar
                ? {
                    uri: item.avatar
                  }
                : require('../logos/Icon.png')
            }
            style={messageListStyles.image}
          />
        </View>
        <View style={messageListStyles.text}>
          <Text style={messageListStyles.author}>{item.author}</Text>
          <Text style={messageListStyles.title} numberOfLines={1}>
            {decodeURI(item.title)}
          </Text>
          <HTMLView
            style={messageListStyles.content}
            value={`<html><body>${item.content}</body></html>`}
            stylesheet={htmlStyles}
            textComponentProps={{
              style: htmlStyles.text
            }}
            nodeComponentProps={{
              numberOfLines: 1
            }}
          />
        </View>
      </View>
    );
  }

  render() {
    return (
      <FlatList
        data={this.props.messages}
        renderItem={this._renderMessage}
        keyExtractor={(item, index) => item.id.toString()}
        ListFooterComponent={
          <View style={messageListStyles.lottieContainer}>
            <Lottie
              style={messageListStyles.lottie}
              ref={animation => {
                this.animation = animation;
              }}
              loop={true}
              autoPlay={true}
              source={require('../assets/loader.json')}
            />
          </View>
        }
      />
    );
  }
}

const messageListStyles = StyleSheet.create({
  messageContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    flex: 1,
    flexDirection: 'row'
  },
  imageContainer: {
    width: 66,
    height: 66
  },
  image: {
    padding: 8,
    width: 50,
    height: 50
  },
  text: {
    flex: 1
  },
  author: {
    fontSize: 9,
    ...fonts.jost300
  },
  title: {
    fontSize: 15,
    ...fonts.jost400
  },
  lottieContainer: {
    flex: 1,
    alignItems: 'center'
  },
  lottie: {
    width: 30,
    height: 30
  }
});

const htmlStyles = StyleSheet.create({
  text: {
    fontSize: 11
  }
});
