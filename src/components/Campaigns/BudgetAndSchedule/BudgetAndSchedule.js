import React, { PropTypes } from 'react';
import TextField from 'material-ui/TextField/TextField';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './BudgetAndSchedule.css';
import DatePicker from 'material-ui/DatePicker/DatePicker';
import TimePicker from 'material-ui/TimePicker/TimePicker';
import { defaultCurrency, AWSConfig } from '../../../config';
import Dialog from 'material-ui/Dialog/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton/FlatButton';
import DropZoneComponent from 'react-dropzone-component';
import { connect } from 'react-redux';
import { budgetChange, scheduleChange,
  frequnceyCapUserChange, frequencyCapSessionChange } from '../../../actions/campaign';
import DownloadIcon from 'material-ui/svg-icons/file/file-download';
import { amber500 }
  from 'material-ui/styles/colors';

class BudgetAndSchedule extends React.Component {
  static propTypes = {
    budget: React.PropTypes.shape({
      currency: React.PropTypes.string,
      total: React.PropTypes.string,
      cpm: React.PropTypes.string,
      campaign_budget_upload: React.PropTypes.string,
    }).isRequired,
    schedule: React.PropTypes.shape({
      startdate: React.PropTypes.string,
      enddate: React.PropTypes.string,
      starttime: React.PropTypes.string,
      endtime: React.PropTypes.string,
      campaign_schedule_upload: React.PropTypes.string,
    }).isRequired,
    fequencyCapUser: React.PropTypes.shape({
      total_views: React.PropTypes.string,
      daily_views: React.PropTypes.string,
    }).isRequired,
    budgetChange: PropTypes.func.isRequired,
    scheduleChange: PropTypes.func.isRequired,
    frequnceyCapUserChange: PropTypes.func.isRequired,
    staticData: React.PropTypes.instanceOf(Map),
    user: React.PropTypes.shape({
      user: React.PropTypes.shape({
        _id: React.PropTypes.string,
      }),
    }),
  };

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      avg: '-',
      budgetDialogOpen: false,
      scheduleDialogOpen: false,
    };
  }

  handleBudgetDialogOpen = () => this.setState({ budgetDialogOpen: true });
  handleBudgetDialogClose = () => this.setState({ budgetDialogOpen: false });

  handleScheduleDialogOpen = () => this.setState({ scheduleDialogOpen: true });
  handleScheduleDialogClose = () => this.setState({ scheduleDialogOpen: false });

  handleTotalBudgetChange = (event, value) => {
    this.props.budgetChange('total', value);
  };

  handleCpmChange = (event, value) => {
    this.props.budgetChange('cpm', value);
  };

  handleStartDateChange = (event, value) => {
    this.props.scheduleChange('startdate', value);
  };

  handleEndDateChange = (event, value) => {
    this.props.scheduleChange('enddate', value);
  };

  handleEndTimeChange = (event, value) => {
    this.props.scheduleChange('endtime', value);
  };

  handleStartTimeChange = (event, value) => {
    this.props.scheduleChange('starttime', value);
  };

  handleMaxDailyChange = (event, value) => {
    this.props.frequnceyCapUserChange('daily_views', value);
  };

  handleMaxTotalChange = (event, value) => {
    this.props.frequnceyCapUserChange('total_views', value);
  };

  removeBudgetFile = () => {
    if (this.state.budgetDialogOpen) {
      this.props.budgetChange('campaign_budget_upload', '');
    }
  };

  completeBudgetFileUploadCallback = (file, data) => {
    if (!data) {
      /* eslint-disable no-console */
      console.log('Error while saving the data');
    } else {
      const budgetUrl = data.key;
      this.props.budgetChange('campaign_budget_upload', budgetUrl);
    }
  };

  removeScheduleFile = () => {
    if (this.state.scheduleDialogOpen) {
      this.props.scheduleChange('campaign_schedule_upload', '');
    }
  };

  completeScheduleFileUploadCallback = (file, data) => {
    if (!data) {
      /* eslint-disable no-console */
      console.log('Error while saving the data');
    } else {
      const scheduleUrl = data.key;
      this.props.scheduleChange('campaign_schedule_upload', scheduleUrl);
    }
  };

  render() {
    const budgetScheduleFormatFileLink = `${AWSConfig.cdnUrl}/public/Campaign.Scheduling.xls`;
    const actionBudget = [
      <RaisedButton
        label="Done"
        primary
        keyboardFocused
        onTouchTap={this.handleBudgetDialogClose}
      />,
    ];
    const actionSchedule = [
      <RaisedButton
        label="Done"
        primary
        keyboardFocused
        onTouchTap={this.handleScheduleDialogClose}
      />,
    ];
    return (
      <div className={s.container}>
        <TextField
          value={this.props.budget.total}
          onChange={this.handleTotalBudgetChange}
          hintText="0"
          floatingLabelText="Total Budget"
        />
        <TextField
          value={this.props.budget.cpm}
          onChange={this.handleCpmChange}
          hintText="CPM"
          floatingLabelText="CPM"
        />
        <span>Schedule</span>
        <FlatButton
          label="Customise"
          onTouchTap={this.handleScheduleDialogOpen}
          style={{ marginRight: 12 }}
        />
        <Dialog
          title="Upload Customise Schedule"
          actions={actionSchedule}
          modal={false}
          open={this.state.scheduleDialogOpen}
          onRequestClose={this.handleScheduleDialogClose}
        >
          <div>
            <DropZoneComponent
              config={{
                iconFiletypes: ['.xlsx'],
                showFiletypeIcon: true,
                postUrl: '/api/content/validateBudget',
              }}
              eventHandlers={{
                removedfile: this.removeScheduleFile,
                success: this.completeScheduleFileUploadCallback,
              }}
              djsConfig={{
                addRemoveLinks: true,
                uploadMultiple: false,
                acceptedFiles:
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,application/x-excel,application/x-msexcel,application/excel', // eslint-disable-line
              }}
            />
            <br />
            Download Format
            <a href={budgetScheduleFormatFileLink} target="_blank">
              <DownloadIcon color="#673ab7" hoverColor={amber500} />
            </a>
          </div>
        </Dialog>
        <div className={s.datecontainer}>
          <DatePicker
            hintText="Start Date"
            value={this.props.schedule.startdate}
            onChange={this.handleStartDateChange}
            defaultDate={this.props.schedule.startdate}
          />
          <DatePicker
            hintText="End Date"
            value={this.props.schedule.enddate}
            onChange={this.handleEndDateChange}
            defaultDate={this.props.schedule.enddate}
          />
        </div>
        <div className={s.datecontainer}>
          <TimePicker
            value={this.props.schedule.starttime}
            onChange={this.handleStartTimeChange}
            hintText="Start Time"
            pedantic
            defaultTime={this.props.schedule.starttime}
          />
          <TimePicker
            value={this.props.schedule.endtime}
            onChange={this.handleEndTimeChange}
            hintText="End Time"
            pedantic
            defaultTime={this.props.schedule.endtime}
          />
        </div>
        <div>
          Average Daily Budget {defaultCurrency}:
          <FlatButton
            label="Customise"
            onTouchTap={this.handleBudgetDialogOpen}
            style={{ marginRight: 12 }}
          />
          <Dialog
            title="Upload Customise Budget"
            actions={actionBudget}
            modal={false}
            open={this.state.budgetDialogOpen}
            onRequestClose={this.handleBudgetDialogClose}
          >
            <div>
              <DropZoneComponent
                config={{
                  iconFiletypes: ['.xlsx'],
                  showFiletypeIcon: true,
                  postUrl: '/api/content/validateBudget',
                }}
                eventHandlers={{
                  removedfile: this.removeBudgetFile,
                  success: this.completeBudgetFileUploadCallback,
                }}
                djsConfig={{
                  addRemoveLinks: true,
                  uploadMultiple: false,
                  acceptedFiles:
                      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,application/x-excel,application/x-msexcel,application/excel', // eslint-disable-line
                }}
              />
              <br />Download Format
              <a href={budgetScheduleFormatFileLink} target="_blank">
                <DownloadIcon color="#673ab7" hoverColor={amber500} />
              </a>
            </div>
          </Dialog>
        </div>
        <TextField
          value={this.props.fequencyCapUser.daily_views}
          onChange={this.handleMaxDailyChange}
          hintText="0"
          floatingLabelText="Max Total Views per Visitor"
        /><br />
        <TextField
          value={this.props.fequencyCapUser.total_views}
          onChange={this.handleMaxTotalChange}
          hintText="0"
          floatingLabelText="Max Daily Views per Visitor"
        /><br />
      </div>
      );
  }
}

export { BudgetAndSchedule as BudgetAndSchedule };

export default withStyles(s)(connect(state => ({
  staticData: state.onemedia.staticData,
  budget: state.onemedia.budget,
  schedule: state.onemedia.schedule,
  fequencyCapUser: state.onemedia.fequencyCapUser,
  fequencyCapSession: state.onemedia.fequencyCapSession,
}),
{ budgetChange, scheduleChange,
  frequnceyCapUserChange, frequencyCapSessionChange })(BudgetAndSchedule));
