import React from 'react';

import { Text, View, FlatList, StyleSheet, Image } from 'react-native';

import { DangerZone } from 'expo';
const { Lottie } = DangerZone;
import { Icon } from 'react-native-elements';
import HTMLView from 'react-native-htmlview';

import { fonts, colors } from '../styles';
import { TouchableRipple } from 'react-native-paper';

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

  _navigateToMessageThreadScreen(item) {
    this.props.navigation.navigate('MessageThread', {
      ...item,
      title: decodeURI(item.title)
    });
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
          <Text style={messageListStyles.author}>
            {item.author} <Text style={messageListStyles.subtext}>wrote</Text>
          </Text>
          <View style={messageListStyles.titleFlex}>
            <Text style={messageListStyles.title}>{decodeURI(item.title)}</Text>
            <View style={messageListStyles.comments}>
              <TouchableRipple
                style={messageListStyles.commentsTouchable}
                onPress={() => this._navigateToMessageThreadScreen(item)}
                rippleColor="rgba(0, 0, 0, .16)"
              >
                <View style={messageListStyles.commentsWrapper}>
                  <Text style={messageListStyles.commentCount}>
                    {item.comments}
                  </Text>
                  <Icon
                    size={18}
                    name="chat-bubble"
                    color={colors.darkBlue}
                    style={messageListStyles.commentIcon}
                  />
                </View>
              </TouchableRipple>
            </View>
          </View>
          <HTMLView
            style={messageListStyles.content}
            value={`<html><body>${item.content}</body></html>`}
            stylesheet={htmlStyles}
            textComponentProps={{
              style: htmlStyles.text
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
    marginBottom: 32,
    flex: 1,
    flexDirection: 'row'
  },
  imageContainer: {
    width: 48,
    height: 48
  },
  image: {
    padding: 6,
    width: 36,
    height: 36
  },
  text: {
    flex: 1
  },
  author: {
    fontSize: 12,
    ...fonts.jost300
  },
  subtext: {
    color: colors.darkBackground
  },
  titleFlex: {
    flex: 1,
    flexDirection: 'row'
  },
  title: {
    flex: 1,
    fontSize: 18,
    ...fonts.jost400
  },
  comments: {
    width: 48,
    justifyContent: 'center',
    borderRadius: 6,
    overflow: 'hidden'
  },
  commentsTouchable: {
    flex: 1
  },
  commentsWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 3
  },
  commentCount: {
    marginRight: 4,
    color: colors.darkBlue
  },
  content: {
    backgroundColor: colors.lightBackground,
    borderRadius: 4,
    padding: 8
  },
  lottieContainer: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 16
  },
  lottie: {
    width: 30,
    height: 30
  }
});

const htmlStyles = StyleSheet.create({
  text: {
    fontSize: 12,
    color: colors.black
  },
  p: {
    marginBottom: 0
  }
});
