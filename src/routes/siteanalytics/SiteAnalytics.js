/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */
import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './SiteAnalytics.css';
import Card from 'material-ui/Card/Card';
import CardHeader from 'material-ui/Card/CardHeader';
import CardMedia from 'material-ui/Card/CardMedia';
import CardText from 'material-ui/Card/CardText';
import ActionHome from 'material-ui/svg-icons/action/home';
import VisitorsIcon from 'material-ui/svg-icons/social/group-add';
import ViewsIcon from 'material-ui/svg-icons/action/visibility';
import CityIcon from 'material-ui/svg-icons/social/location-city';
import Avatar from 'material-ui/Avatar';
import Table from 'material-ui/Table/Table';
import TableHeaderColumn from 'material-ui/Table/TableHeaderColumn';
import TableRow from 'material-ui/Table/TableRow';
import TableHeader from 'material-ui/Table/TableHeader';
import TableRowColumn from 'material-ui/Table/TableRowColumn';
import TableBody from 'material-ui/Table/TableBody';
import LinearProgress from 'material-ui/LinearProgress';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FilterIcon from 'material-ui/svg-icons/content/filter-list';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker/DatePicker';
import TrendingDownIcon from 'material-ui/svg-icons/action/trending-down';
import TrendingUpIcon from 'material-ui/svg-icons/action/trending-up';
import TrendingFlatIcon from 'material-ui/svg-icons/action/trending-flat';
import { red900, green900, grey500 }
  from 'material-ui/styles/colors';
import { Line as LineChart, Pie as PieChart } from 'react-chartjs';
import numeral from 'numeral';
import moment from 'moment';
import { onemediaDateFormat } from '../../config';
import { connect } from 'react-redux';
import { fetchSiteReport } from '../../actions/site';
import { snackBarClose } from '../../actions/util';

const chartOptions = { pointDotRadius: 0, maintainAspectRatio: false, responsive: true };

class SiteAnalytics extends React.Component {

  static propTypes = {
    siteAnalyticsData: PropTypes.array.isRequired,
    fetchSiteReport: PropTypes.func.isRequired,
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
    this.props.fetchSiteReport(this.props.user.user._id, this.props.apiMode);
  }

  handleFilterOpen = () => this.setState({ openFilterDialog: true });

  handleFilterClose = () => this.setState({ openFilterDialog: false });

  handleFilterData = async () => {
    this.props.fetchSiteReport(this.props.user.user._id, this.props.apiMode,
      moment(this.state.startDate).format('YYYY-MM-DD'),
      moment(this.state.endDate).format('YYYY-MM-DD')
    );
    this.setState({ openFilterDialog: false });
  };

  handleStartDateChange = (event, value) => this.setState({ startDate: value });

  handleEndDateChange = (event, value) => this.setState({ endDate: value });

  handleTraddingIcon = (change) => {
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

  renderSelectedDates = () => {
    const startDate = moment(this.state.startDate).format(onemediaDateFormat);
    const endDate = moment(this.state.endDate).format(onemediaDateFormat);
    return (
      <div className={s.selecteddate_container}>
        <span className={s.selecteddate}>Selected Dates: ({startDate} To {endDate})</span>
      </div>
    );
  };

  renderTable = (chartData) => (
    <Table selectable={false}>
      <TableHeader displaySelectAll={false}>
        <TableRow>
          <TableHeaderColumn
            colSpan="6"
            tooltip="Visitor Activities"
            style={{ textAlign: 'center' }}
          >
            Visitor Activities
          </TableHeaderColumn>
        </TableRow>
        <TableRow>
          <TableHeaderColumn>ID</TableHeaderColumn>
          <TableHeaderColumn>Sections</TableHeaderColumn>
          <TableHeaderColumn>Visitors</TableHeaderColumn>
          <TableHeaderColumn>PageViews per Visitors</TableHeaderColumn>
          <TableHeaderColumn>Items Added toCart</TableHeaderColumn>
          <TableHeaderColumn>Items bought</TableHeaderColumn>
        </TableRow>
      </TableHeader>
      <TableBody displayRowCheckbox={false}>
        {chartData.map((row, index) => (
          <TableRow key={index} >
            <TableRowColumn>{index}</TableRowColumn>
            <TableRowColumn>{row.sections}</TableRowColumn>
            <TableRowColumn>{row.visitors}</TableRowColumn>
            <TableRowColumn>{row.pv_per_visitors}</TableRowColumn>
            <TableRowColumn>{row.items_added_to_cart}</TableRowColumn>
            <TableRowColumn>{row.items_bought}</TableRowColumn>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  renderPieGraph = (title, chartData) => (
    <div className={s.graph}>
      <Card >
        <CardHeader
          title={title}
          subtitle="Subtitle"
          avatar={<Avatar icon={<ActionHome />} />}
        />
        <CardMedia>
          <PieChart
            data={chartData}
            options={chartOptions} width="100%" height="250"
          />
        </CardMedia>
      </Card>
    </div>
  );

  renderLineGraph = (title, subtitle, initiallyExpanded, chartData, icon) => (
    <div className={s.graph}>
      <Card initiallyExpanded={initiallyExpanded}>
        <CardHeader
          title={title}
          subtitle={subtitle}
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

  renderNumber = (title, number) => (
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

  render() {
    const actions = [
      <RaisedButton
        label="Ok"
        primary
        keyboardFocused
        onTouchTap={this.handleFilterData}
      />,
    ];
    const retVal = this.props.siteAnalyticsData ? (
      <div>
        <div className={s.subheader}>Site Traffic</div>
        {this.renderSelectedDates()}
        <div className={s.all_siteanaltics_wrapper}>

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
              onChange={this.handleStartDateChange}
              value={this.state.startDate} hintText="Start Date"
            />
            <DatePicker
              onChange={this.handleEndDateChange}
              minDate={this.state.startDate}
              value={this.state.endDate} hintText="End Date"
            />
          </Dialog>
          <div className={s.siteanaltics_wrapper}>
            <div className={s.numberswrapper}>
              <div className={s.numbers}>
                {this.renderNumber('Visitors',
                numeral(this.props.siteAnalyticsData.metrics.visitors).format('0.0a'))}
                {this.renderNumber('Cart Users',
                numeral(this.props.siteAnalyticsData.metrics.cartusers).format('0,0'))}
                {this.renderNumber('Buyers',
                numeral(this.props.siteAnalyticsData.metrics.buyers).format('0,0'))}
              </div>
            </div>
            <div className={s.graphssandtoday}>
              <div className={s.graphsswrapper}>
                <div className={s.graphs}>
                  {this.renderLineGraph('Visitors', '', true,
                  this.props.siteAnalyticsData.data.visitors.data, <VisitorsIcon />)}
                  {this.renderLineGraph('Views', '', true,
                  this.props.siteAnalyticsData.data.views.data, <ViewsIcon />)}
                </div>
              </div>
              <div className={s.todaysstatswrapper}>
                <Card>
                  <CardHeader subtitle="Today's Stats" />
                  <CardMedia>
                    <div className={s.progressbarcontainer}>
                      <span>{numeral(this.props.siteAnalyticsData.today.buyers.value)
                        .format('0,0')} Buys</span>
                      <div>
                        <span>{numeral(this.props.siteAnalyticsData.today.buyers.change)
                          .format('0.00')}%</span>
                        {this.handleTraddingIcon(this.props.
                          siteAnalyticsData.today.buyers.change)}
                      </div>
                    </div>
                    <LinearProgress
                      mode="determinate"
                      max={this.props.siteAnalyticsData.today.buyers.yesterdaytotal}
                      value={this.props.siteAnalyticsData.today.buyers.value}
                    />
                    <div className={s.progressbarcontainer}>
                      <span>{numeral(this.props.siteAnalyticsData.today.cartusers.value)
                        .format('0,0')} Cart Views</span>
                      <div>
                        <span>{numeral(this.props.siteAnalyticsData.today.cartusers.change)
                          .format('0.00')}%</span>
                        {this.handleTraddingIcon(this.props.
                          siteAnalyticsData.today.cartusers.change)}
                      </div>
                    </div>
                    <LinearProgress
                      mode="determinate"
                      max={this.props.siteAnalyticsData.today.cartusers.yesterdaytotal}
                      value={this.props.siteAnalyticsData.today.cartusers.value}
                    />
                    <div className={s.progressbarcontainer}>
                      <span>{numeral(this.props.siteAnalyticsData.today.visitors.value)
                        .format('0.0a')} Page Views</span>
                      <div>
                        <span>{numeral(this.props.siteAnalyticsData.today.visitors.change)
                          .format('0.00')}%</span>
                        {this.handleTraddingIcon(this.props.
                          siteAnalyticsData.today.visitors.change)}
                      </div>
                    </div>
                    <LinearProgress
                      mode="determinate"
                      max={this.props.siteAnalyticsData.today.visitors.yesterdaytotal}
                      value={this.props.siteAnalyticsData.today.visitors.value}
                    />
                  </CardMedia>
                </Card>
              </div>
            </div>
          </div>
          <div className={s.visitorscardwrapper}>
            <Card initiallyExpanded>
              <CardHeader
                title="Visitor Details"
                actAsExpander
                showExpandableButton
              />
              <CardMedia expandable>
                <div className={s.visitorscardlayout}>
                  <div className={s.visitorscardrow}>
                    {this.renderLineGraph('Visitors By City', 'Tier 1 Vs Tier 2', true,
                    this.props.siteAnalyticsData.data.visitorsbycity.data, <CityIcon />)}
                  </div>
                </div>
              </CardMedia>
            </Card>
          </div>
        </div>
      </div>
    ) : (
      <div>
        <span>Loading...</span>
      </div>
    );
    return retVal;
  }
}

export { SiteAnalytics as SiteAnalytics };

export default withStyles(s)(connect(state => ({
  user: state.onemedia.loggedInUser,
  siteAnalyticsData: state.onemedia.siteAnalyticsGraphData,
  snackBarMessage: state.onemedia.snackBarMessage,
  apiMode: state.runtime.apiMode,
}),
{ fetchSiteReport, snackBarClose })(SiteAnalytics));
