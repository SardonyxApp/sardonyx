import React from 'react';

import { StyleSheet } from 'react-native';

import { Badge } from 'react-native-paper';
import { connect } from 'react-redux';

import { colors } from '../styles';

class NotificationBadge extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      this.props.overview.notificationCount ? (
        <Badge style={[notificationBadgeStyles.badgeIcon, this.props.style]} size={18}>
          {this.props.overview.notificationCount}
        </Badge>
      ) : null
    );
  }
}

const notificationBadgeStyles = StyleSheet.create({
  badgeIcon: {
    position: 'absolute',
    top: -5,
    color: colors.white,
    backgroundColor: colors.primary
  }
});

const mapStateToProps = state => {
  const overview = state.managebac.overview;
  return { overview };
};

export default connect(mapStateToProps)(NotificationBadge);
