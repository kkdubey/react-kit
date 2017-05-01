import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Dashboard.css';
import Card from 'material-ui/Card/Card';
import CardHeader from 'material-ui/Card/CardHeader';
import CardMedia from 'material-ui/Card/CardMedia';
import CardText from 'material-ui/Card/CardText';
import RemoveRedEye from 'material-ui/svg-icons/image/remove-red-eye';
import TouchApp from 'material-ui/svg-icons/action/touch-app';
import MouseBlack from 'material-ui/svg-icons/hardware/mouse';
import MoneyIcon from 'material-ui/svg-icons/editor/monetization-on';
import DownloadIcon from 'material-ui/svg-icons/file/file-download';
import Avatar from 'material-ui/Avatar';
import LinearProgress from 'material-ui/LinearProgress';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FilterIcon from 'material-ui/svg-icons/content/filter-list';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker/DatePicker';
import TrendingDownIcon from 'material-ui/svg-icons/action/trending-down';
import TrendingUpIcon from 'material-ui/svg-icons/action/trending-up';
import TrendingFlatIcon from 'material-ui/svg-icons/action/trending-flat';
import moment from 'moment';
import { onemediaDateFormat } from '../../config';
import { red900, green900, white, amber500, grey500 }
  from 'material-ui/styles/colors';
import { Line as LineChart } from 'react-chartjs';
import numeral from 'numeral';
import Snackbar from 'material-ui/Snackbar/Snackbar';
import StopCampaignIcon from '../../components/StopCampaignIcon/StopCampaignIcon';
import { connect } from 'react-redux';
import { fetchCampaignReport, fetchCampaignsListAndReports } from '../../actions/campaign';
import { snackBarClose } from '../../actions/util';

const chartOptions = { pointDotRadius: 0, maintainAspectRatio: false, responsive: true };
class Dashboard extends React.Component {

  static propTypes = {
    campaignGraphDataSet: PropTypes.array.isRequired,
    campaigns: PropTypes.array.isRequired,
    fetchCampaignReport: PropTypes.func.isRequired,
    fetchCampaignsListAndReports: PropTypes.func.isRequired,
    snackBarClose: PropTypes.func.isRequired,
    snackBarMessage: PropTypes.string.isRequired,
    apiMode: PropTypes.string.isRequired,
    user: React.PropTypes.shape({
      user: React.PropTypes.shape({
        _id: React.PropTypes.string,
      }),
    }),
  };

  constructor(props) {
    super(props);
    this.state = {
      openFilterDialog: false,
      endDate: new Date(),
      startDate: new Date(new Date().setDate(new Date().getDate() - 7)),
    };
  }

  componentDidMount() {
    if (this.props.campaigns && this.props.campaigns.length > 0) {
      this.props.fetchCampaignReport(this.props.user.user._id,
        this.props.apiMode, this.props.campaigns);
    } else {
      this.props.fetchCampaignsListAndReports(this.props.user.user._id,
        this.props.apiMode);
    }
  }

  handleFilterOpen = () => this.setState({ openFilterDialog: true });
  handleFilterData = async () => {
    this.props.fetchCampaignReport(this.props.user.user._id,
      this.props.apiMode,
      this.props.campaigns,
      moment(this.state.startDate).format('YYYY-MM-DD'),
      moment(this.state.endDate).format('YYYY-MM-DD'));
    this.setState({ openFilterDialog: false });
  };

  handleFilterClose = () => {
    this.setState({ openFilterDialog: false });
  };

  handleStartDateChange = (event, date) => {
    this.setState({
      startDate: date,
    });
  };

  handleEndDateChange = (event, date) => {
    this.setState({
      endDate: date,
    });
  };

  snackBarIsOpen = () => {
    if (this.props.snackBarMessage && this.props.snackBarMessage.trim() !== '') {
      return true;
    }

    return false;
  };

  handleTrendingIcon = (change) => {
    let retVal;
    if (change > 0) {
      retVal = <TrendingUpIcon color={green900} />;
    } else if (change < 0) {
      retVal = <TrendingDownIcon color={red900} />;
    } else {
      retVal = <TrendingFlatIcon color={grey500} />;
    }

    return retVal;
  };

  renderGraph = (title, chartData, initiallyExpanded, icon) =>
    (
    <div className={s.graph}>
      <Card initiallyExpanded={initiallyExpanded}>
        <CardHeader
          title={title}
          avatar={<Avatar icon={icon} />}
          actAsExpander
          showExpandableButton
        />
        <CardMedia expandable>
          <LineChart
            data={chartData}
            options={chartOptions} width="100%" height="250" redraw
          />
        </CardMedia>
      </Card>
    </div>
    );

  renderNumber = (title, number) =>
    (
    <div className={s.number}>
      <div className={s.numberbg}>
        <Card>
          <CardHeader
            title={number}
            titleStyle={{ fontSize: '180%' }}
          />
          <CardText>
          {title}
          </CardText>
        </Card>
      </div>
    </div>
    );

  renderCampaign = (campaign, stats) => {
    const start = moment(this.state.startDate).format('YYYY-MM-DD');
    const end = moment(this.state.endDate).format('YYYY-MM-DD');
    const apiDownload = `/api/content/${campaign._id}/download?startdate=${start}&enddate=${end}`;
    return (
      <Card key={campaign._id} initiallyExpanded >
        <CardHeader
          title={campaign.campaign_name}
          className={s.campaign_header}
          actAsExpander showExpandableButton
        />
        <CardMedia>
          <div className={s.campaignActionsBar}>
            <StopCampaignIcon
              snackBar={this.handlesnackBar}
              campaign={campaign}
            />
            <a href={apiDownload} target="_blank">
              <DownloadIcon color={white} hoverColor={amber500} />
            </a>
          </div>
        </CardMedia>
        <CardMedia expandable>
          <div className={s.campaign_wrapper}>
            <div className={s.numberswrapper}>
              <div className={s.numbers}>
                {this.renderNumber('Spend', `₹${numeral(stats.metrics.spend)
                  .format('0,0')}`)}
                {this.renderNumber('Impressions',
                  numeral(stats.metrics.impressions).format('0.0a'))}
                {this.renderNumber('Clicks', numeral(stats.metrics.clicks)
                  .format('0,0'))}
                {this.renderNumber('CTR', `${numeral(stats.metrics.ctr)
                  .format('0.00')}%`)}
                {this.renderNumber('CPC', `₹${numeral(stats.metrics.cpc)
                  .format('0.00')}`)}
                {this.renderNumber('eCPM', `₹${numeral(stats.metrics.ecpm).
                  format('0.00')}`)}
                {this.renderNumber('Unique Reach',
                  `${numeral(stats.metrics.uniquereach).format('0.0a')}`)}
                {this.renderNumber('View Thru Transaction',
                  `${numeral(stats.metrics.vtt).format('0,0')}`)}
                {this.renderNumber('Click Thru Transaction',
                  `${numeral(stats.metrics.ctt).format('0,0')}`)}
              </div>
            </div>


            <div className={s.graphssandtoday}>
              <div className={s.graphsswrapper}>
                <div className={s.graphs}>
                  {this.renderGraph('Impressions', stats.data.impressions.data,
                    true, <RemoveRedEye />)}
                  {this.renderGraph('Clicks', stats.data.clicks.data,
                    false, <TouchApp />)}
                  {this.renderGraph('CTR', stats.data.ctr.data,
                    false, <MouseBlack />)}
                  {this.renderGraph('CPC', stats.data.cpc.data,
                    false, <MoneyIcon />)}
                </div>
              </div>
              <div className={s.todaysstatswrapper}>
                <Card>
                  <CardHeader
                    subtitle={'Today\'s Stats '}
                    titleStyle={{ fontSize: '180%' }}
                  />
                  <CardMedia>
                    <div className={s.progressbarcontainer}>
                      <span>{numeral(stats.today.impressions.value)
                        .format('0.0a')} Impressions</span>
                      <div>
                        <span>{numeral(stats.today.impressions.change)
                          .format('0.00')} %</span>
                        {this.handleTrendingIcon(stats.today.impressions.change)}
                      </div>
                    </div>
                    <LinearProgress
                      mode="determinate"
                      max={stats.today.impressions.yesterdaytotal === 0
                        ? 100 : stats.today.impressions.yesterdaytotal}
                      value={stats.today.impressions.value}
                    />
                    <div className={s.progressbarcontainer}>
                      <span>{numeral(stats.today.clicks.value)
                        .format('0,0')} Clicks</span>
                      <div>
                        <span>{numeral(stats.today.clicks.change)
                          .format('0.00')} %</span>
                        {this.handleTrendingIcon(stats.today.clicks.change)}
                      </div>
                    </div>
                    <LinearProgress
                      mode="determinate"
                      max={stats.today.clicks.yesterdaytotal === 0
                        ? 100 : stats.today.clicks.yesterdaytotal}
                      value={stats.today.clicks.value}
                    />
                    <div className={s.progressbarcontainer}>
                      <span>₹{numeral(stats.today.spend.value)
                        .format('0.0a')} Spend</span>
                      <div>
                        <span>{numeral(stats.today.spend.change)
                          .format('0.00')}%</span>
                        {this.handleTrendingIcon(stats.today.spend.change)}
                      </div>
                    </div>
                    <LinearProgress
                      mode="determinate"
                      max={stats.today.spend.yesterdaytotal === 0
                        ? 100 : stats.today.spend.yesterdaytotal}
                      value={stats.today.spend.value}
                    />
                    <div className={s.progressbarcontainer}>
                      <span>{numeral(stats.today.ctr.value)
                        .format('0.00')} CTR</span>
                      <div>
                        <span>{numeral(stats.today.ctr.change)
                          .format('0.00')} %</span>
                        {this.handleTrendingIcon(stats.today.ctr.change)}
                      </div>
                    </div>
                    <LinearProgress
                      mode="determinate"
                      max={stats.today.ctr.yesterdaytotal === 0
                        ? 100 : stats.today.ctr.yesterdaytotal}
                      value={stats.today.ctr.value}
                    />
                    <div className={s.progressbarcontainer}>
                      <span>{numeral(stats.today.cpc.value)
                        .format('0,0')} CPC</span>
                      <div>
                        <span>{numeral(stats.today.cpc.change)
                          .format('0.00')} %</span>
                        {this.handleTrendingIcon(stats.today.cpc.change)}
                      </div>
                    </div>
                    <LinearProgress
                      mode="determinate"
                      max={stats.today.cpc.yesterdaytotal === 0
                        ? 100 : stats.today.cpc.yesterdaytotal}
                      value={stats.today.cpc.value}
                    />
                    <div className={s.progressbarcontainer}>
                      <span>{numeral(stats.today.ctxn.value)
                        .format('0,0')} Click thru Transaction</span>
                      <div>
                        <span>{numeral(stats.today.ctxn.change)
                          .format('0.00')} %</span>
                        {this.handleTrendingIcon(stats.today.ctxn.change)}
                      </div>
                    </div>
                    <LinearProgress
                      mode="determinate"
                      max={stats.today.ctxn.yesterdaytotal === 0
                        ? 100 : stats.today.ctxn.yesterdaytotal}
                      value={stats.today.ctxn.value}
                    />
                    <div className={s.progressbarcontainer}>
                      <span>{numeral(stats.today.vtxn.value)
                        .format('0,0')} View thru Transaction</span>
                      <div>
                        <span>{numeral(stats.today.vtxn.change)
                          .format('0.00')} %</span>
                        {this.handleTrendingIcon(stats.today.vtxn.change)}
                      </div>
                    </div>
                    <LinearProgress
                      mode="determinate"
                      max={stats.today.vtxn.yesterdaytotal === 0
                        ? 100 : stats.today.vtxn.yesterdaytotal}
                      value={stats.today.vtxn.value}
                    />
                  </CardMedia>
                </Card>
              </div>
            </div>
          </div>
        </CardMedia>
      </Card>
    );
  };

  renderSelectedDates = () => {
    const startDate = moment(this.state.startDate).format(onemediaDateFormat);
    const endDate = moment(this.state.endDate).format(onemediaDateFormat);
    return (
      <div className={s.selecteddate_container}>
        <span className={s.selecteddate}>Selected Dates: ({startDate} To {endDate})</span>
      </div>
   );
  };

  renderCampaigns = () => (
    <div className={s.all_campaigns_wrapper}>
      {
        this.props.campaigns.map((campaign, index) => this.renderCampaign(campaign,
        this.props.campaignGraphDataSet[index]))
      }
    </div>
  );

  renderLoading = () => (
    <div>
      <span>Loading...</span>
    </div>
  );

  render() {
    const actions = [
      <RaisedButton
        label="Ok"
        primary
        onTouchTap={this.handleFilterData}
      />,
    ];
    const retVal = (
      <div>
        <div className={s.subheader}>Campaign Dashboard</div>
        <FloatingActionButton
          secondary
          className={s.fab_wrapper} onTouchTap={this.handleFilterOpen}
        >
          <FilterIcon />
        </FloatingActionButton>

        <Dialog
          title="Display Period"
          actions={actions}
          modal={false}
          open={this.state.openFilterDialog}
          onRequestClose={this.handleFilterClose}
        >
          <DatePicker
            value={this.state.startDate}
            onChange={this.handleStartDateChange} hintText="Start Date"
          />
          <DatePicker
            value={this.state.endDate}
            minDate={this.state.startDate}
            onChange={this.handleEndDateChange} hintText="End Date"
          />
        </Dialog>
        {this.renderSelectedDates()}
        {
          this.props.campaignGraphDataSet.length > 0 ?
          this.renderCampaigns() : this.renderLoading()
        }
        <Snackbar
          className={s.snackbarStyle}
          open={this.snackBarIsOpen()}
          message={this.props.snackBarMessage}
          autoHideDuration={4000}
          onRequestClose={this.props.snackBarClose}
        />
      </div>
    );
    return retVal;
  }
}

export { Dashboard as Dashboard };

export default withStyles(s)(connect(state => ({
  user: state.onemedia.loggedInUser,
  disableFeatures: state.onemedia.disableFeatures,
  campaigns: state.onemedia.activeCampaigns,
  campaignGraphDataSet: state.onemedia.campaignGraphDataSet,
  snackBarMessage: state.onemedia.snackBarMessage,
  apiMode: state.runtime.apiMode,
}),
{ fetchCampaignReport, fetchCampaignsListAndReports, snackBarClose })(Dashboard));
