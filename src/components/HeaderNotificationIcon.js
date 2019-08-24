import React from 'react';

import { Icon } from 'react-native-elements';
import { connect } from 'react-redux';

import HeaderIcon from './HeaderIcon';
import NotificationBadge from './NotificationBadge';
import { colors } from '../styles';

class HeaderNotificationIcon extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate() {
    console.log(this.props.overview);
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
        <NotificationBadge />
      </HeaderIcon>
    );
  }
}

const mapStateToProps = state => {
  const overview = state.managebac.overview;
  return { overview };
};

export default connect(mapStateToProps)(HeaderNotificationIcon);
