import React from 'react';

import {
  Linking,
  ScrollView,
  SectionList,
  Text,
  View,
  Image,
  StyleSheet,
  Alert
} from 'react-native';

import { TouchableRipple, Switch } from 'react-native-paper';
import { bindActionCreators } from 'redux';
import { setSettings } from '../actions';
import { connect } from 'react-redux';
import { version } from '../../package.json';

import { Storage } from '../helpers';
import { colors, fonts, elevations } from '../styles';

class SettingsScreen extends React.Component {
  settingsSections = [
    {
      title: 'General',
      data: [
        {
          title: 'Animations on Overview',
          description:
            'Enable to show stick figure animations in the ManageBac Overview page.',
          type: 'checkbox',
          redux: 'general.showOverviewAnimation'
        },
        {
          title: 'Start app on ManageBac',
          description:
            'Enable to launch the app on the ManageBac page instead of Tasks. (applies from next launch)',
          type: 'checkbox',
          redux: 'general.firstScreenManagebac'
        },
        {
          title: 'Configure default tasklist labels',
          description:
            'Select the labels to filter the tasklist for by default. (applies from next launch)',
          onPress: () => this._handleNavigateToUserLabels()
        }
      ]
    },
    {
      title: 'Account',
      data: [
        {
          title: 'Sign out',
          onPress: () => this._confirmLogout()
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
        },
        {
          title: 'Version Info',
          description: version
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
    this._handleNavigateToUserLabels = this._handleNavigateToUserLabels.bind(
      this
    );
    this._renderRow = this._renderRow.bind(this);
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

  _confirmLogout() {
    Alert.alert('', 'Are you sure you want to log out?', [
      {
        text: 'No!'
      },
      {
        text: 'Log me out please.',
        onPress: this._handleLogout
      }
    ]);
  }

  _handleLogout() {
    Storage.deleteCredentials()
      .then(() => {
        this.props.navigation.navigate('Login', {
          errorMessage: null
        });
      })
      .catch(err => {
        console.error(err);
        Alert.alert('', 'There was an error while logging out: ' + err);
      });
  }

  _handleNavigateToUserLabels() {
    this.props.navigation.navigate('EditUserLabels');
  }

  _objectKeyByString(o, s) {
    s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, ''); // strip a leading dot
    var a = s.split('.');
    for (var i = 0, n = a.length; i < n; ++i) {
      var k = a[i];
      if (k in o) {
        o = o[k];
      } else {
        return;
      }
    }
    return o;
  }

  _renderCheckboxRow(item) {
    const reduxValue = this._objectKeyByString(this.props.settings, item.redux);
    return (
      <TouchableRipple
        onPress={() => {
          this.props.setSettings(item.redux, !reduxValue);
        }}
      >
        <View style={[settingsStyles.item, settingsStyles.checkboxItem]}>
          <View style={settingsStyles.nonCheckboxContainer}>
            <Text style={settingsStyles.title}>{item.title}</Text>
            {item.description ? (
              <Text style={settingsStyles.description}>{item.description}</Text>
            ) : null}
          </View>
          <View style={settingsStyles.checkboxContainer}>
            <Switch
              color={colors.primary}
              value={reduxValue}
              onValueChange={() => {
                this.props.setSettings(item.redux, !reduxValue);
              }}
            />
          </View>
        </View>
      </TouchableRipple>
    );
  }

  _renderRow({ item }) {
    return (
      <View style={settingsStyles.itemContainer}>
        {item.type === 'checkbox' ? (
          this._renderCheckboxRow(item)
        ) : (
          <TouchableRipple onPress={item.onPress}>
            <View style={settingsStyles.item}>
              <Text style={settingsStyles.title}>{item.title}</Text>
              {item.description ? (
                <Text style={settingsStyles.description}>
                  {item.description}
                </Text>
              ) : null}
            </View>
          </TouchableRipple>
        )}
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
              this.props.user.avatar
                ? {
                    uri: this.props.user.avatar
                  }
                : require('../assets/logos/Icon.png')
            }
            style={settingsStyles.profileIcon}
          />
          <Text style={settingsStyles.profileName}>{this.props.user.name}</Text>
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
    ...elevations.two
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
    marginTop: 6
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
  checkboxItem: {
    flexDirection: 'row'
  },
  checkboxContainer: {
    marginLeft: 16,
    justifyContent: 'center'
  },
  nonCheckboxContainer: {
    flex: 1
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

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setSettings
    },
    dispatch
  );

const mapStateToProps = state => {
  const settings = state.settings;
  const user = state.managebac.overview.user;
  return { settings, user };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsScreen);
