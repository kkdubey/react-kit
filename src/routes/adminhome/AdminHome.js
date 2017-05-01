import React, { PropTypes } from 'react';
import s from './AdminHome.css';
import withStyles from '../../../node_modules/isomorphic-style-loader/lib/withStyles';
import Table from 'material-ui/Table/Table';
import TableHeaderColumn from 'material-ui/Table/TableHeaderColumn';
import TableRow from 'material-ui/Table/TableRow';
import TableHeader from 'material-ui/Table/TableHeader';
import TableRowColumn from 'material-ui/Table/TableRowColumn';
import TableBody from 'material-ui/Table/TableBody';
import CampaignStatus from '../../components/CampaignStatus';
import Snackbar from 'material-ui/Snackbar/Snackbar';
import EditCampaign from '../../components/EditCampaign/EditCampaign';
import { onemediaDateFormat } from '../../config';
import moment from 'moment';
import { connect } from 'react-redux';
import { snackBarClose } from '../../actions/util';
import { fetchCampaignsList } from '../../actions/campaign';
import numeral from 'numeral';

const style = {
  columnStyle: {
    paddingLeft: '0px !important',
  },
};
function getStatusStyle(status) {
  let statusStyle = {};
  if (status === 'Pending') {
    statusStyle = { color: 'red' };
    return statusStyle;
  } else if (status === 'Started') {
    statusStyle = { color: 'green' };
  } else if (status === 'Stopped') {
    statusStyle = { color: 'black' };
  } else {
    statusStyle = { color: 'pink' };
  }

  return statusStyle;
}

const displayStatus = new Map([
    ['Pending', 'Pending'],
    ['Started', 'Running'],
    ['Stopped', 'Stopped'],
]);

class AdminHome extends React.Component {
  static propTypes = {
    campaigns: React.PropTypes.arrayOf(React.PropTypes.shape({
      _id: React.PropTypes.string,
      campaign_running_status: React.PropTypes.string,
      campaign_name: React.PropTypes.string,
      performance: React.PropTypes.shape({
        impression: React.PropTypes.number,
      }),
    })),
    fetchCampaignsList: PropTypes.func.isRequired,
    snackBarClose: PropTypes.func.isRequired,
    snackBarMessage: React.PropTypes.string,
    disableFeatures: React.PropTypes.bool,
    user: React.PropTypes.shape({
      user: React.PropTypes.shape({
        _id: React.PropTypes.string,
      }),
    }),
  };

  componentDidMount() {
    this.props.fetchCampaignsList(this.props.user.user._id);
  }

  getCampaignListTableBody = (campaigns) => (

    <TableBody displayRowCheckbox={false}>
      {campaigns.map((row, index) => (
        <TableRow key={index}>
          <TableRowColumn className={s.columnRowName}>{row.campaign_name}</TableRowColumn>
          <TableRowColumn>
            <div>
              {moment(new Date(row.startdate))
                .format(onemediaDateFormat)}
            </div>
            <div className={s.alignCenter}>
              To
            </div>
            <div>
              {moment(new Date(row.enddate))
                .format(onemediaDateFormat)}
            </div>
          </TableRowColumn>
          <TableRowColumn>{numeral(row.performance.impressions).format('0.0a')}</TableRowColumn>
          <TableRowColumn>{numeral(row.performance.clicks).format('0,0')}</TableRowColumn>
          <TableRowColumn>₹{numeral(row.performance.spend).format('0,0')}</TableRowColumn>
          <TableRowColumn>{numeral(row.performance.ctr).format('0.00')}%</TableRowColumn>
          <TableRowColumn>₹{numeral(row.performance.cpc).format('0.00')}</TableRowColumn>
          <TableRowColumn style={getStatusStyle(row.campaign_running_status)}>
            {displayStatus.get(row.campaign_running_status) || row.campaign_running_status}
          </TableRowColumn>
          <TableRowColumn style={style.columnStyle}>
            <CampaignStatus campaign={row} />
          </TableRowColumn>
          <TableRowColumn>
            <EditCampaign campaign={row} />
          </TableRowColumn>
        </TableRow>
      ))}
    </TableBody>
  );

  snackBarIsOpen = () => {
    if (this.props.snackBarMessage && this.props.snackBarMessage.trim() !== '') {
      return true;
    }

    return false;
  };

  renderNoCampaign = () => (
    <TableBody displayRowCheckbox={false}>
      <TableRow>
        <TableRowColumn colSpan="8">
          No campaigns are configured for your account
        </TableRowColumn>
      </TableRow>
    </TableBody>
  );

  render() {
    return (
      <div className={s.root} >
        <div className={s.subheader}>Admin Home</div>
        <div className={s.tabcontentmargin}>
          <Table>
            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
              <TableRow>
                <TableHeaderColumn className={s.columnHeaderName}>Campaign</TableHeaderColumn>
                <TableHeaderColumn className={s.columnHeader}>Period</TableHeaderColumn>
                <TableHeaderColumn className={s.columnHeader}>Impression</TableHeaderColumn>
                <TableHeaderColumn className={s.columnHeader}>Clicks</TableHeaderColumn>
                <TableHeaderColumn className={s.columnHeader}>Spend</TableHeaderColumn>
                <TableHeaderColumn className={s.columnHeader}>CTR</TableHeaderColumn>
                <TableHeaderColumn className={s.columnHeader}>CPC</TableHeaderColumn>
                <TableHeaderColumn className={s.columnHeader}>Status</TableHeaderColumn>
                <TableHeaderColumn />
                <TableHeaderColumn />
              </TableRow>
            </TableHeader>
            {this.props.campaigns.length === 0 ?
              this.renderNoCampaign()
                : this.getCampaignListTableBody(this.props.campaigns)}
          </Table>
        </div>
        <Snackbar
          className={s.snackbarStyle}
          open={this.snackBarIsOpen()}
          message={this.props.snackBarMessage}
          autoHideDuration={4000}
          onRequestClose={this.props.snackBarClose}
        />
      </div>
    );
  }
}

export { AdminHome as AdminHome };

export default withStyles(s)(connect(state => ({
  user: state.onemedia.loggedInUser,
  disableFeatures: state.onemedia.disableFeatures,
  campaigns: state.onemedia.activeCampaigns,
  snackBarMessage: state.onemedia.snackBarMessage,
}),
{ snackBarClose, fetchCampaignsList })(AdminHome));
