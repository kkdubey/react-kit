import React, { PropTypes } from 'react';
import StopIcon from 'material-ui/svg-icons/av/stop';
import StartIcon from 'material-ui/svg-icons/av/play-arrow';
import { white, amber500 } from 'material-ui/styles/colors';
import { connect } from 'react-redux';
import { updateCampaign } from '../../actions/campaign';

class StopCampaignIcon extends React.Component {

  static propTypes = {
    campaign: React.PropTypes.shape({
      _id: React.PropTypes.string,
      campaign_running_status: React.PropTypes.string,
    }).isRequired,
    changeStatus: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      campaign: props.campaign,
    };
  }

  handleChangeRunning = () => {
    this.props.changeStatus(this.props.campaign._id, 'Started');
  };

  handleChangeStopped = () => {
    this.props.changeStatus(this.props.campaign._id, 'Stopped');
  };

  render() {
    let retval;
    if (this.props.campaign.campaign_running_status === 'Started') {
      retval = (
        <div >
          <StopIcon
            onTouchTap={this.handleChangeStopped}
            color={white} hoverColor={amber500}
          />
        </div>
      );
    } else if (this.props.campaign.campaign_running_status === 'Stopped') {
      retval = (
        <div >
          <StartIcon
            onTouchTap={this.handleChangeRunning}
            color={white} hoverColor={amber500}
          />
        </div>
      );
    } else {
      retval = (
        <div ></div>
      );
    }

    return retval;
  }
}

export { StopCampaignIcon as StopCampaignIcon };

export default (connect(state => ({
  user: state.onemedia.loggedInUser,
  disableFeatures: state.onemedia.disableFeatures,
}),
{ changeStatus: updateCampaign })(StopCampaignIcon));

