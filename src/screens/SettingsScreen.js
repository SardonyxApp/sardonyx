import React from 'react';

import {
  Linking,
  ScrollView,
  SectionList,
  Text,
  View,
  Image,
  StyleSheet
} from 'react-native';

import { TouchableRipple } from 'react-native-paper';
import { connect } from 'react-redux';

import { Storage } from '../helpers';
import { colors, fonts, styles } from '../styles';

class SettingsScreen extends React.Component {
  settingsSections = [
    {
      title: 'General',
      data: [
        {
          title: 'Example Item',
          description:
            "I can't find a way to implement settings which affect the entire app, is Redux the way to go? I don't know."
        }
      ]
    },
    {
      title: 'Account',
      data: [
        {
          title: 'Sign out',
          onPress: () => this._handleLogout()
        }
      ]
    },
    {
      title: 'Sardonyx',
      data: [
        {
          title: 'Visit Website',
          onPress: () => Linking.openURL('https://sardonyx.app/?redirect=false')
        },
        {
          title: 'Privacy Policy',
          onPress: () => Linking.openURL('https://sardonyx.app/privacy/')
        },
        {
          title: 'Terms of Service',
          onPress: () => Linking.openURL('https://sardonyx.app/terms')
        }
      ]
    }
  ];

  constructor(props) {
    super(props);

    this.state = {
      userInfo: {}
    };
    this._handleLogout = this._handleLogout.bind(this);
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: 'Settings',
      headerStyle: {
        backgroundColor: colors.white
      },
      headerTintColor: colors.primary,
      headerTitleStyle: {
        fontWeight: 'normal',
        ...fonts.jost400
      }
    };
  };

  componentDidMount() {
    this._getOverviewData().then(data => {
      this.setState({
        userInfo: data.user
      });
    });
  }

  /**
   * Asynchronous function that returns a Promise for getting overview data.
   * @return {Promise}
   */
  _getOverviewData() {
    return new Promise(resolve => {
      Storage.retrieveValue('managebacOverview')
        .then(data => {
          resolve(JSON.parse(data));
        })
        .catch(err => {
          console.warn(err);
        });
    });
  }

  _handleLogout() {
    this.props.navigation.navigate('Logout');
  }

  _renderRow({ item }) {
    return (
      <View style={settingsStyles.itemContainer}>
        <TouchableRipple onPress={item.onPress}>
          <View style={settingsStyles.item}>
            <Text style={settingsStyles.title}>{item.title}</Text>
            {item.description ? (
              <Text style={settingsStyles.description}>{item.description}</Text>
            ) : null}
          </View>
        </TouchableRipple>
      </View>
    );
  }

  _renderHeader({ section }) {
    return (
      <View style={settingsStyles.sectionHeader}>
        <Text style={settingsStyles.sectionHeaderText}>{section.title}</Text>
      </View>
    );
  }

  render() {
    return (
      <ScrollView style={settingsStyles.page}>
        <View style={[settingsStyles.item, settingsStyles.profileRow]}>
          <Image
            source={
              this.state.userInfo.avatar
                ? {
                    uri: this.state.userInfo.avatar
                  }
                : require('../logos/Icon.png')
            }
            style={settingsStyles.profileIcon}
          />
          <Text style={settingsStyles.profileName}>
            {this.state.userInfo.name}
          </Text>
        </View>
        <SectionList
          style={settingsStyles.page}
          sections={this.settingsSections}
          keyExtractor={(item, index) => index.toString()}
          renderItem={this._renderRow}
          renderSectionHeader={this._renderHeader}
        />
      </ScrollView>
    );
  }
}

const settingsStyles = StyleSheet.create({
  page: {
    flex: 1
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 32,
    marginBottom: 8,
    elevation: 2
  },
  profileIcon: {
    width: 64,
    height: 64,
    borderRadius: 32
  },
  profileName: {
    marginLeft: 16,
    flex: 1,
    fontSize: 24,
    ...fonts.jost500
  },
  sectionHeader: {
    marginTop: 4
  },
  sectionHeaderText: {
    fontSize: 14,
    paddingHorizontal: 16,
    ...fonts.jost500,
    color: colors.primary
  },
  itemContainer: {
    backgroundColor: colors.white
  },
  item: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    justifyContent: 'center'
  },
  title: {
    fontSize: 16,
    ...fonts.jost500,
    color: colors.black
  },
  description: {
    fontSize: 14,
    color: colors.darkBackground
  }
});

const mapStateToProps = (state) => {
  const settings = state.settings;
  return { settings };
}

export default connect(mapStateToProps)(SettingsScreen)