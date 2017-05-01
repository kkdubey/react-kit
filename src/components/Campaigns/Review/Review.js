import React, { PropTypes } from 'react';
import RaisedButton from 'material-ui/RaisedButton/RaisedButton';
import PreviewAd from '../../PreviewAd/PreviewAd';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Review.css';
import Toolbar from 'material-ui/Toolbar/Toolbar';
import ToolbarGroup from 'material-ui/Toolbar/ToolbarGroup';
import { connect } from 'react-redux';
import { saveCampaign } from '../../../actions/campaign';

class Review extends React.Component {
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
    location: React.PropTypes.shape({
      cities: React.PropTypes.array,
      locationInclude: React.PropTypes.bool,
    }).isRequired,
    objective: React.PropTypes.shape({
      campaign_name: React.PropTypes.string,
      campaign_brand_category: React.PropTypes.string,
      campaign_objective: React.PropTypes.string,
      campaign_type: React.PropTypes.string,
    }).isRequired,
    target: React.PropTypes.shape({
      gender: React.PropTypes.string,
      income_group: React.PropTypes.array,
      tags: React.PropTypes.array,
      agegroup: React.PropTypes.array,
      interests: React.PropTypes.array,
      websites: React.PropTypes.array,
      tagsInclude: React.PropTypes.bool,
      interestsInclude: React.PropTypes.bool,
      webSitesInclude: React.PropTypes.bool,
    }).isRequired,
    saveCampaign: PropTypes.func.isRequired,
    creatives: PropTypes.arrayOf(React.PropTypes.shape({
      creativeId: React.PropTypes.string,
      cdnUrl: React.PropTypes.string,
      imageHeight: React.PropTypes.string,
      imageWidth: React.PropTypes.string,
    })),
    user: React.PropTypes.shape({
      user: React.PropTypes.shape({
        _id: React.PropTypes.string,
      }),
    }),
  };

  handleArray = (obj) => {
    let retval = '';
    if (obj) {
      obj.map((row) => (
        retval = `${retval}${row}, `
      ));
    }

    return retval;
  };

  handleImageMapping = () => {
    let retval = [];
    for (let img of Object.keys(this.props.creatives)) {
      retval.push(
        <div>
          <img role="presentation" className={s.imagesize} src={this.props.creatives[img]} />
        </div>
      );
    }

    return <div className={s.flexdiv}>{retval}</div>;
  };

  handleAverageDailybudget = (total, cpm) => {
    let retval = 0;
    console.log(total, cpm);
    if (!total || total === undefined || total === 0) {
      retval = 0;
    } else if (!cpm || cpm === undefined || cpm === 0) {
      retval = 0;
    } else if (total > 0 && cpm > 0) {
      retval = total / cpm;
    }

    return retval;
  };

  handleWebsite = (obj) => this.handleArray(obj);

  handleTags = (obj) => this.handleArray(obj);

  handleLocations = (obj) => this.handleArray(obj);

  render() {
    return (
      <div>
        <Toolbar>
          <ToolbarGroup firstChild>
            Objective
          </ToolbarGroup>
          <ToolbarGroup>
            <RaisedButton label="Edit" primary />
          </ToolbarGroup>
        </Toolbar>
        <div className={s.label}>Campaign Name</div>
        <div className={s.value}>{this.props.objective.campaign_name}</div>
        <div className={s.label}>Category</div>
        <div className={s.value}>{this.props.objective.campaign_objective}</div>
        <div className={s.label}>Campaign Type</div>
        <div className={s.value}>{this.props.objective.campaign_brand_category}</div>
        <div className={s.label}>Channel</div>
        <div className={s.value}>{this.props.objective.campaign_type}</div>
        <Toolbar>
          <ToolbarGroup firstChild>
            Ad Creatives
          </ToolbarGroup>
          <ToolbarGroup>
            <RaisedButton label="Edit" primary />
          </ToolbarGroup>
        </Toolbar>
        <div>
          <PreviewAd />
        </div>
        <Toolbar>
          <ToolbarGroup firstChild>
            Target
          </ToolbarGroup>
          <ToolbarGroup>
            <RaisedButton label="Edit" primary />
          </ToolbarGroup>
        </Toolbar>
        <div className={s.label}>Gender</div>
        <div className={s.value}>{this.props.target.gender}</div>
        <div className={s.label}>Age Group</div>
        <div className={s.value}>{this.props.target.agegroup}</div>
        <div className={s.label}>Income Group</div>
        <div className={s.value}>{this.props.target.income_group}</div>
        <div className={s.label}>Interest</div>
        <div className={s.value}>{(this.props.target.interests)
         }
        </div>
        <div className={s.label}>Tags</div>
        <div className={s.value}>{this.handleTags(this.props.target.tags)}
        </div>
        <div className={s.label}>Websites</div>
        <div className={s.value}>{this.handleWebsite(this.props.target.websites)}
        </div>
        <Toolbar>
          <ToolbarGroup firstChild>
            Location
          </ToolbarGroup>
          <ToolbarGroup>
            <RaisedButton label="Edit" primary />
          </ToolbarGroup>
        </Toolbar>
        <div className={s.label}>City</div>
        <div className={s.value}>{this.handleLocations(this.props.location.cities)}</div>
        <div className={s.label}>Place of interests</div>
        <div></div>
        <Toolbar>
          <ToolbarGroup firstChild>
            Budget & Schedule
          </ToolbarGroup>
          <ToolbarGroup>
            <RaisedButton label="Edit" primary />
          </ToolbarGroup>
        </Toolbar>
        <div className={s.label}>Total Budget</div>
        <div className={s.value}>Rs {this.props.budget.total}</div>
        <div className={s.label}>Daily Limit</div>
        <div className={s.value}>Rs {this.props.budget.total}</div>
        <div className={s.label}>Total Budget</div>
        <div className={s.value}>Rs {this.props.budget.cpm}</div>
        <div className={s.label}>Average Daily Budget</div>
        <div className={s.value}>Rs
          {this.handleAverageDailybudget(this.props.budget.total, this.props.budget.cpm)}</div>
        <div className={s.label}>Start Date</div>
        <div className={s.value}>{this.props.schedule.startdate.toString()}
        </div>
        <div className={s.label}>End Date</div>
        <div className={s.value}>{this.props.schedule.enddate.toString()}
        </div>
        <div className={s.label}>Start Time</div>
        <div className={s.value}>{this.props.schedule.starttime.toString()}
        </div>
        <div className={s.label}>End Time</div>
        <div className={s.value}>{this.props.schedule.endtime.toString()}
        </div>
        <div className={s.label}>Max Total Views per visitor</div>
        <div className={s.value}>{this.props.fequencyCapUser.daily_views}</div>
        <div className={s.label}>Max Daily Views per visitor</div>
        <div className={s.value}>{this.props.fequencyCapUser.total_views}</div>
        <br />
      </div>
      );
  }
}

export { Review as Review };

export default withStyles(s)(connect(state => ({
  budget: state.onemedia.budget,
  schedule: state.onemedia.schedule,
  fequencyCapUser: state.onemedia.fequencyCapUser,
  fequencyCapSession: state.onemedia.fequencyCapSession,
  objective: state.onemedia.objective,
  creatives: state.onemedia.creatives,
  target: state.onemedia.target,
  location: state.onemedia.location,
}),
{ saveCampaign })(Review));

