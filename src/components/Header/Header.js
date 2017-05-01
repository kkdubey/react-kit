import React, { PropTypes } from 'react';
import AppBar from 'material-ui/AppBar';
import Navigation from '../Navigation';
import MenuItem from 'material-ui/MenuItem/MenuItem';
import IconMenu from 'material-ui/IconMenu/IconMenu';
import IconButton from 'material-ui/IconButton/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Location from '../../core/history';
import Avatar from 'material-ui/Avatar/Avatar';
import FlatButton from 'material-ui/FlatButton/FlatButton';
import PersonAdd from 'material-ui/svg-icons/action/account-circle';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Header.css';
import Link from '../Link';
import { connect } from 'react-redux';
import { logout } from '../../actions/logout';
import { fullWhite } from 'material-ui/styles/colors';

class Header extends React.Component {
  static propTypes = {
    logout: PropTypes.func.isRequired,
    disableFeatures: React.PropTypes.bool,
    user: React.PropTypes.shape({
      status: React.PropTypes.string,
      avtaarUrl: React.PropTypes.string,
      user: React.PropTypes.shape({
        name: React.PropTypes.string,
      }),
    }),
  };

  redirectToHome =() => Location.push('/');

  render() {
    let retVal;
    if (this.props.user.status !== 'OK') {
      retVal = (
        <AppBar
          className={s.appbar} style={{ position: 'fixed' }}
          title={
            <img
              src={require('./logo-small.png')}
              alt="OneMedia Platform"
              onClick={this.redirectToHome}
            />
          }
          iconElementLeft={<Navigation />}
          iconElementRight={
            <div>
              <Link className={s.link} to="/Signin">
                <FlatButton
                  label="Signin"
                  style={{ color: fullWhite }}
                  icon={<Avatar icon={<PersonAdd color={fullWhite} />} />}
                />
              </Link>
              <IconMenu
                iconButtonElement={<IconButton><MoreVertIcon color={fullWhite} /></IconButton>}
                anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                targetOrigin={{ horizontal: 'right', vertical: 'top' }}
              >
                <MenuItem
                  primaryText="Send feedback"
                  href="mailto:operations@onedigitalad.com?subject=OneMedia Feedback"
                />
                <MenuItem primaryText="Help" disabled />
              </IconMenu>
            </div>
          }
        />
      );
    } else {
      retVal = (
        <AppBar
          className={s.appbar} style={{ position: 'fixed' }}
          title={<img
            src={require('./logo-small.png')}
            alt="OneMedia" onTitleTouchTap={this.redirectToHome}
          />}
          onTitleTouchTap={this.redirectToHome}
          iconElementLeft={<Navigation {...this.props} />}
          iconElementRight={
            <div>
              <FlatButton
                label={this.props.user.user.name}
                linkButton
                style={{ color: fullWhite }}
                icon={<Avatar src={this.props.user.avtaarUrl} color={fullWhite} />}
              />
              <IconMenu
                iconButtonElement={<IconButton><MoreVertIcon color={fullWhite} /></IconButton>}
                anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                targetOrigin={{ horizontal: 'right', vertical: 'top' }}
              >
                <MenuItem
                  primaryText="Send feedback"
                  href="mailto:operations@onedigitalad.com?subject=OneMedia Feedback"
                />
                <MenuItem primaryText="Help" disabled />
                <MenuItem primaryText="Sign out" onTouchTap={this.props.logout} />
              </IconMenu>
            </div>
          }
        />
      );
    }

    return (
      <header>
        {retVal}
      </header>
      );
  }

}

export { Header as Header };

export default withStyles(s)(connect(state => ({
  user: state.onemedia.loggedInUser,
  disableFeatures: state.onemedia.disableFeatures,
}), {
  logout,
})(Header));
