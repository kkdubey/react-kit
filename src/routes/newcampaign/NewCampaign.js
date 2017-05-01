import React, { PropTypes } from 'react';
import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';
import Objective from '../../components/Campaigns/Objective';
import Creative from '../../components/Campaigns/Creative';
import Target from '../../components/Campaigns/Target';
import BudgetAndSchedule from '../../components/Campaigns/BudgetAndSchedule';
import CountTo from 'react-count-to';
import s from './NewCampaign.css';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Location from '../../components/Campaigns/Location';
import Review from '../../components/Campaigns/Review';
import ExpandTransition from 'material-ui/internal/ExpandTransition';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Toolbar from 'material-ui/Toolbar/Toolbar';
import ToolbarGroup from 'material-ui/Toolbar/ToolbarGroup';
import ToolbarTitle from 'material-ui/Toolbar/ToolbarTitle';
import Snackbar from 'material-ui/Snackbar';
import { connect } from 'react-redux';
import { fetchStaticData } from '../../actions/static_data';
import { snackBarClose } from '../../actions/util';
import { newCampaign, saveCampaign } from '../../actions/campaign';

class NewCampaign extends React.Component {

  static propTypes = {
    fetchStaticData: PropTypes.func.isRequired,
    isEditingCampaign: PropTypes.bool.isRequired,
    newCampaign: PropTypes.func.isRequired,
    saveCampaign: PropTypes.func.isRequired,
    reachFrom: PropTypes.number.isRequired,
    reachTo: PropTypes.number.isRequired,
    snackBarClose: PropTypes.func.isRequired,
    snackBarMessage: PropTypes.string.isRequired,
    campaign: PropTypes.object.isRequired,
    creatives: PropTypes.array.isRequired,
    objective: PropTypes.object.isRequired,
    target: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    budget: PropTypes.object.isRequired,
    schedule: PropTypes.object.isRequired,
    fequencyCapUser: PropTypes.object.isRequired,
    fequencyCapSession: PropTypes.object.isRequired,
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
      loading: false,
      finished: false,
      stepIndex: 0,
      activeStep: -1,
      lastActiveStep: 0,
      snackBar: {
        SnackBarOpen: false,
        SnackBarText: '',
      },
    };
  }

  componentDidMount() {
    if (!this.props.isEditingCampaign) {
      this.props.newCampaign(this.props.user.user._id);
    }

    this.props.fetchStaticData();
  }

  getStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return (
          <div>
            <Objective />
          </div>
        );
      case 1:
        return (
          <div>
            <Creative />
          </div>
        );
      case 2:
        return (
          <div>
            <Target />
          </div>
        );
      case 3:
        return (
          <div>
            <Location />
          </div>
        );
      case 4:
        return (
          <div>
            <BudgetAndSchedule />
          </div>
        );
      case 5:
        return (
          <div>
            <Review />
          </div>
        );
      default:
        return 'Campaign Successfully created.';
    }
  };

  updateCompletedSteps = (currentStep) =>
    currentStep < this.state.lastActiveStep;

  save = () => {
    this.props.saveCampaign(
      this.props.isEditingCampaign,
      this.props.campaign,
      this.props.objective,
      this.props.creatives,
      this.props.target,
      this.props.location,
      this.props.budget,
      this.props.schedule,
      this.props.fequencyCapUser,
      this.props.fequencyCapSession,
    );
  };

  snackBarIsOpen = () => {
    if (this.props.snackBarMessage && this.props.snackBarMessage.trim() !== '') {
      return true;
    }

    return false;
  };

  dummyAsync = (cb) => {
    this.setState({ loading: true }, () => {
      this.asyncTimer = setTimeout(cb, 500);
    });
  };

  handleNext = () => {
    const { stepIndex } = this.state;
    if (!this.state.loading) {
      this.dummyAsync(() => this.setState({
        loading: false,
        stepIndex: stepIndex + 1,
        finished: stepIndex >= 5,
      }));
    }
  };

  handlePrev = () => {
    const { stepIndex } = this.state;
    if (!this.state.loading) {
      this.dummyAsync(() => this.setState({
        loading: false,
        stepIndex: stepIndex - 1,
      }));
    }
  };

  renderContent = () => {
    const { finished, stepIndex } = this.state;
    const contentStyle = { margin: '0 16px', overflow: 'hidden' };

    if (finished) {
      return (
        <div style={contentStyle}>
          <p>
            Campaign Successfully created.
          </p>
        </div>
      );
    }

    return (
      <div style={contentStyle}>
        <div>{this.getStepContent(stepIndex)}</div>
        <div style={{ marginTop: 24, marginBottom: 12 }}>
          <FlatButton
            label="Back"
            disabled={stepIndex === 0}
            onTouchTap={this.handlePrev}
            style={{ marginRight: 12 }}
          />
          <RaisedButton
            label={stepIndex === 5 ? 'Finish' : 'Next'}
            primary
            onTouchTap={stepIndex === 5 ? this.save : this.handleNext}
          />
          <FlatButton
            disabled
            label="Save Draft"
          />
        </div>
      </div>
    );
  };

  render() {
    const { loading, stepIndex } = this.state;

    return this.props.staticData ? (
      <div className={s.conatainer}>
        <Toolbar className={s.subheader}>
          <ToolbarGroup>
            <ToolbarTitle text="New Campaign" />
          </ToolbarGroup>
          <ToolbarGroup>
            <div className={s.counterStyle} >
              <div className={s.counterTextStyle}>Target Reach</div>
              <div className={s.counterTextStyle_2}>
                <CountTo
                  from={this.props.reachFrom}
                  to={this.props.reachTo} speed={500}
                />
              </div>
            </div>
          </ToolbarGroup>
        </Toolbar>
        <div style={{ width: '100%', margin: 'auto' }}>
          <Stepper activeStep={stepIndex}>
            <Step>
              <StepLabel>Objective</StepLabel>
            </Step>
            <Step>
              <StepLabel>Creative</StepLabel>
            </Step>
            <Step>
              <StepLabel>Target</StepLabel>
            </Step>
            <Step>
              <StepLabel>Location</StepLabel>
            </Step>
            <Step>
              <StepLabel>Budget & Schedule</StepLabel>
            </Step>
            <Step>
              <StepLabel>Review</StepLabel>
            </Step>
          </Stepper>
          <ExpandTransition loading={loading} open >
            {this.renderContent()}
          </ExpandTransition>
        </div>
        <Snackbar
          className={s.snackbarStyle}
          open={this.snackBarIsOpen()}
          message={this.props.snackBarMessage}
          autoHideDuration={4000}
          onRequestClose={this.props.snackBarClose}
        />
      </div>
    ) : (
      <div>
        <span>Loading...</span>
      </div>
    );
  }
}

export { NewCampaign as NewCampaign };

export default withStyles(s)(connect(state => ({
  user: state.onemedia.loggedInUser,
  campaigns: state.onemedia.activeCampaigns,
  snackBarMessage: state.onemedia.snackBarMessage,
  staticData: state.onemedia.staticData,
  reachFrom: state.onemedia.reachFrom,
  reachTo: state.onemedia.reachTo,
  campaign: state.onemedia.campaignForEdit,
  isEditingCampaign: state.onemedia.isEditingCampaign,
  budget: state.onemedia.budget,
  schedule: state.onemedia.schedule,
  fequencyCapUser: state.onemedia.fequencyCapUser,
  fequencyCapSession: state.onemedia.fequencyCapSession,
  objective: state.onemedia.objective,
  creatives: state.onemedia.creatives,
  target: state.onemedia.target,
  location: state.onemedia.location,
  showSavingInProgress: state.onemedia.showSavingInProgress,
}),
{ fetchStaticData, newCampaign, saveCampaign, snackBarClose })(NewCampaign));
