import React, { PropTypes } from 'react';
import s from './CampaignStatus.css';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import RaisedButton from 'material-ui/RaisedButton/RaisedButton';
import { connect } from 'react-redux';
import { updateCampaign } from '../../actions/campaign';

const allowedStatusTransition = new Map([
    ['Pending', 'Approved'],
    ['Approved', 'Started'],
    ['Started', 'Stopped'],
    ['Stopped', 'Started'],
]);

const displayStatus = new Map([
    ['Approved', 'Approve'],
    ['Started', 'Start'],
    ['Stopped', 'Stop'],
]);

class CampaignStatus extends React.Component {

  static propTypes = {
    campaign: React.PropTypes.shape({
      _id: React.PropTypes.string,
      campaign_running_status: React.PropTypes.string,
      enddate: React.PropTypes.string,
    }).isRequired,
    changeStatus: PropTypes.func.isRequired,
    disableFeatures: React.PropTypes.bool,
  };

  updateStatus = (oldStatus, newStatus, campaignId) => {
    console.log('Updating status', oldStatus, newStatus, campaignId);
    this.props.changeStatus(campaignId, newStatus);
  };

  render() {
    let retval;
    const oldStatus = this.props.campaign.campaign_running_status;
    const campaignId = this.props.campaign._id;
    const newStatus = allowedStatusTransition.get(oldStatus);
    if (this.props.campaign.campaign_running_status === 'Archive') {
      retval = (
        <div >
          <RaisedButton
            onTouchTap={() => {
              this.updateStatus(oldStatus, 'Archive', campaignId);
            }}

            label="Delete" disabled
          />
        </div>
      );
    } else if (new Date(this.props.campaign.enddate) < new Date()) {
      retval = (
        <div >
          <RaisedButton
            onTouchTap={() => {
              this.updateStatus(oldStatus, 'Archive', campaignId);
            }}

            label="Archive" disabled={this.props.disableFeatures}
          />
        </div>
      );
    } else if (newStatus) {
      retval = (
        <div >
          <RaisedButton
            onTouchTap={() => {
              this.updateStatus(oldStatus, newStatus, campaignId);
            }}

            label={displayStatus.get(newStatus)} disabled={this.props.disableFeatures}
          />
        </div>
      );
    } else {
      retval = (
        <div className={s.root}>
          <RaisedButton
            label={oldStatus} disabled
          />
        </div>
      );
    }

    return retval;
  }
}

export { CampaignStatus as CampaignStatus };

export default withStyles(s)(connect(state => ({
  user: state.onemedia.loggedInUser,
  disableFeatures: state.onemedia.disableFeatures,
}),
{ changeStatus: updateCampaign })(CampaignStatus));

