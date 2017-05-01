import React from 'react';
import LeftNav from 'material-ui/Drawer/Drawer';
import MenuItem from 'material-ui/MenuItem/MenuItem';
import IconButton from 'material-ui/IconButton/IconButton';
import s from './Navigation.css';
import Location from '../../core/history';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';
import HomeIcon from 'material-ui/svg-icons/action/home';
import DnsIcon from 'material-ui/svg-icons/action/dns';
import ForumIcon from 'material-ui/svg-icons/communication/forum';
import EmailIcon from 'material-ui/svg-icons/communication/email';
import DashboardIcon from 'material-ui/svg-icons/action/dashboard';
import NewCampaign from 'material-ui/svg-icons/content/create';
import Admin from 'material-ui/svg-icons/action/supervisor-account';
import Traffic from 'material-ui/svg-icons/action/assessment';
import { fullWhite } from 'material-ui/styles/colors';

class Navigation extends React.Component {
  static propTypes = {
    user: React.PropTypes.shape({
      status: React.PropTypes.string,
      user: React.PropTypes.shape({
        email: React.PropTypes.string,
      }),
    }),
    disableFeatures: React.PropTypes.bool,
  };
  constructor(props) {
    super(props);
    this.state = { open: false };
  }

  handleToggle = () => this.setState({ open: !this.state.open });

  handleClose = () => this.setState({ open: false });

  handleAdminClick = () => {
    this.setState({ open: false });
    Location.push('/AdminHome');
  };

  redirectToHome = () => {
    this.handleClose();
    Location.push('/');
  };

  redirectToUnderConstruction = () => {
    Location.push('/UnderConstruction');
    this.setState({ open: false });
  };

  handleCampaignsDashboardClick = () => {
    Location.push('/dashboard');
    this.setState({ open: false });
  };

  handleSiteAnalyticsClick = () => {
    Location.push('/siteanalytics');
    this.setState({ open: false });
  };

  redirectToNewCampaign = () => {
    Location.push('/NewCampaign');
    this.setState({ open: false });
  };

  requestChangeHandler = (open) => this.setState({ open });

  isCurrentMenu = (menu) => {
    let retVal = false;
    if (process.env.BROWSER && window.location) {
      switch (menu) {
        case 'NEWCAMPAIGN':
          retVal = location.pathname === '/NewCampaign';
          break;
        case 'TRAFFIC':
          retVal = location.pathname === '/siteanalytics';
          break;
        case 'ADMIN':
          retVal = location.pathname === '/AdminHome';
          break;
        case 'DASHBOARD':
          retVal = location.pathname === '/dashboard';
          break;
        case 'HOME':
          retVal = location.pathname === '/';
          break;
        default:
          return false;
      }
    }

    return retVal;
  };

  render() {
    let retVal;
    if (this.props.user === undefined || this.props.user.status !== 'OK') {
      retVal = (
        <div className={s.root} >
          <IconButton onTouchTap={this.handleToggle}>
            <NavigationMenu color={fullWhite} />
          </IconButton>
          <LeftNav
            docked={false}
            width={250}
            open={this.state.open}
            onRequestChange={this.requestChangeHandler}
          >
            <MenuItem
              primaryText="Home" leftIcon={<HomeIcon />}
              onTouchTap={this.redirectToHome}
            />
            <MenuItem
              primaryText="Features" leftIcon={<DnsIcon />}
              onTouchTap={this.redirectToUnderConstruction}
            />
            <MenuItem
              primaryText="Case Study and Testimonials"
              leftIcon={<ForumIcon />} onTouchTap={this.redirectToUnderConstruction}
            />
            <MenuItem
              primaryText="Contact us for demo"
              leftIcon={<EmailIcon />} onTouchTap={this.redirectToUnderConstruction}
            />
          </LeftNav>
        </div>
      );
    } else if (this.props.disableFeatures) {
      retVal = (
        <div className={s.root} >
          <IconButton onTouchTap={this.handleToggle}>
            <NavigationMenu color={fullWhite} />
          </IconButton>
          <LeftNav
            docked={false}
            width={250}
            open={this.state.open}
            onRequestChange={this.requestChangeHandler}
          >
            <MenuItem
              primaryText="Home" leftIcon={<HomeIcon />}
              onTouchTap={this.redirectToHome}
            />
            <MenuItem
              primaryText="Campaigns Reports" leftIcon={<DashboardIcon />}
              disabled={this.isCurrentMenu('DASHBOARD')}
              onTouchTap={this.handleCampaignsDashboardClick}
            />
            <MenuItem
              primaryText="Campaigns Admin" leftIcon={<Admin />}
              disabled={this.isCurrentMenu('ADMIN')}
              onTouchTap={this.handleAdminClick}
            />
            <MenuItem
              primaryText="Site Visitor Report" leftIcon={<Traffic />}
              disabled={this.isCurrentMenu('TRAFFIC')}
              onTouchTap={this.handleSiteAnalyticsClick}
            />
            <MenuItem
              primaryText="New Campaign" disabled leftIcon={<NewCampaign />}
              onTouchTap={this.redirectToNewCampaign}
            />
          </LeftNav>
        </div>
      );
    } else {
      retVal = (
        <div className={s.root} >
          <IconButton onTouchTap={this.handleToggle}>
            <NavigationMenu color={fullWhite} />
          </IconButton>
          <LeftNav
            docked={false}
            width={250}
            open={this.state.open}
            onRequestChange={this.requestChangeHandler}
          >
            <MenuItem
              primaryText="Home" leftIcon={<HomeIcon />}
              disabled={this.isCurrentMenu('HOME')}
              onTouchTap={this.redirectToHome}
            />
            <MenuItem
              primaryText="Campaigns Reports" leftIcon={<DashboardIcon />}
              disabled={this.isCurrentMenu('DASHBOARD')}
              onTouchTap={this.handleCampaignsDashboardClick}
            />
            <MenuItem
              primaryText="Campaigns Admin" leftIcon={<Admin />}
              disabled={this.isCurrentMenu('ADMIN')}
              onTouchTap={this.handleAdminClick}
            />
            <MenuItem
              primaryText="Site Visitor Report" leftIcon={<Traffic />}
              disabled={this.isCurrentMenu('TRAFFIC')}
              onTouchTap={this.handleSiteAnalyticsClick}
            />
            <MenuItem
              primaryText="New Campaign" leftIcon={<NewCampaign />}
              disabled={this.isCurrentMenu('NEWCAMPAIGN')}
              onTouchTap={this.redirectToNewCampaign}
            />
          </LeftNav>
        </div>
      );
    }

    return retVal;
  }
}

export { Navigation as Navigation };
export default withStyles(s)(Navigation);
