import React from 'react';

import { StyleSheet } from 'react-native';

import { Icon } from 'react-native-elements';
import { Badge } from 'react-native-paper';
import { connect } from 'react-redux';

import HeaderIcon from './HeaderIcon';
import { colors } from '../styles';

class HeaderNotificationIcon extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <HeaderIcon onPress={this.props.onPress}>
        <Icon
          name={
            this.props.overview.notificationCount
              ? 'notifications-active'
              : 'notifications-none'
          }
          color={colors.white}
        />
        {this.props.overview.notificationCount ? (
          <Badge style={notificationIconStyles.badgeIcon} size={16}>
            {this.props.overview.notificationCount}
          </Badge>
        ) : null}
      </HeaderIcon>
    );
  }
}

const notificationIconStyles = StyleSheet.create({
  badgeIcon: {
    position: 'absolute',
    top: -4,
    backgroundColor: colors.lightError
  }
});

const mapStateToProps = state => {
  const overview = state.managebac.overview;
  return { overview };
};

export default connect(mapStateToProps)(HeaderNotificationIcon);
