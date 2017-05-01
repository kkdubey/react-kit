import React, { PropTypes } from 'react';
import RadioButton from 'material-ui/RadioButton/RadioButton';
import RadioButtonGroup from 'material-ui/RadioButton/RadioButtonGroup';
import TextField from 'material-ui/TextField/TextField';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Objective.css';
import SelectField from 'material-ui/SelectField/SelectField';
import MenuItem from 'material-ui/MenuItem/MenuItem';
import { connect } from 'react-redux';
import { fetchTargetReach } from '../../../actions/static_data';
import { objectiveFieldChanged, copyFromCampaign } from '../../../actions/campaign';

class Objective extends React.Component {

  static propTypes = {
    campaigns: PropTypes.array.isRequired,
    campaign: React.PropTypes.shape({
      campaign_name: React.PropTypes.string,
      campaign_brand_category: React.PropTypes.string,
      campaign_objective: React.PropTypes.string,
      campaign_type: React.PropTypes.string,
    }).isRequired,
    fetchTargetReach: PropTypes.func.isRequired,
    copyFromCampaign: PropTypes.func.isRequired,
    objectiveFieldChanged: PropTypes.func.isRequired,
    isEdit: PropTypes.bool.isRequired,
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
      isDisable: true,
      isNewCampaignSelected: 'fresh',
      copyCampaign: '',
    };
  }

  handleBrandCategoryChange = (event, index, value) => {
    this.props.objectiveFieldChanged('campaign_brand_category', value);
  };

  handleCampaignNameChange = (event, value) => {
    this.props.objectiveFieldChanged('campaign_name', value);
  };

  handleCampaignObjectiveChange = (event, value) => {
    this.props.objectiveFieldChanged('campaign_objective', value);
  };

  handleCampaignTypeChange = (event, value) => {
    this.props.objectiveFieldChanged('campaign_type', value);
  };

  handleCopyCampaignDropDown = (event, value) => {
    this.setState({ isNewCampaignSelected: value });
    if (value === 'fresh') {
      this.setState({ isDisable: true });
    } else {
      this.setState({ isDisable: false });
    }
  };

  handleCopyCampaignChange = async (event, index, value) => {
    this.props.copyFromCampaign(value.split('_')[0]);
  };

  render() {
    return (
      <div className={s.container}>
        <RadioButtonGroup
          name="isNewCampaign"
          valueSelected={this.state.isNewCampaignSelected}
          onChange={this.handleCopyCampaignDropDown}
          style={{ display: 'flex', flexDirection: 'row' }}
        >
          <RadioButton
            value="fresh"
            label="Create A Fresh" style={{ width: 'auto' }}
            disabled={this.props.isEdit}
          />
          <RadioButton
            value="existing"
            label="Copy from Existing Campaigns"
            disabled={this.props.isEdit}
          />
        </RadioButtonGroup>

        <SelectField
          value={this.state.copyCampaign}
          onChange={this.handleCopyCampaignChange}
          floatingLabelText="Select Campaign"
          disabled={this.state.isDisable}
        >
          {this.props.campaigns.map((row, index) => (
            <MenuItem
              key={index}
              value={`${row._id}_${row.campaign_name}`}
              primaryText={row.campaign_name}
            />
          ))}
        </SelectField><br />
        <TextField
          value={this.props.campaign.campaign_name}
          onChange={this.handleCampaignNameChange}
          hintText="Campaign Name"
          floatingLabelText="Campaign Name"
        /><br />
        <SelectField
          value={this.props.campaign.campaign_brand_category}
          onChange={this.handleBrandCategoryChange}
          floatingLabelText="Brand Category"
        >
          {this.props.staticData.get('brand_category').map((row, index) => (
            <MenuItem key={index} value={row} primaryText={row} />
          ))}
        </SelectField><br />
        <TextField
          value={this.props.campaign.campaign_objective}
          onChange={this.handleCampaignObjectiveChange}
          hintText="Campaign Objective"
          floatingLabelText="Campaign Objective"
        /><br />
        <div className={s.radiocontainer}>
          <span className={s.formlabel}>Campaign Type:</span>
          <RadioButtonGroup
            name="campaigntype"
            valueSelected={this.props.campaign.campaign_type}
            onChange={this.handleCampaignTypeChange}
            style={{ display: 'flex', flexDirection: 'row' }}
          >
            <RadioButton
              value="Web"
              label="Web" style={{ width: 'auto', marginRight: '10px' }}
            />
            <RadioButton
              value="MobileApp"
              label="MobileApp" style={{ width: 'auto', marginRight: '10px' }}
            />
            <RadioButton
              value="MobileWeb"
              label="MobileWeb" style={{ width: 'auto', marginRight: '10px' }}
            />
            <RadioButton
              value="Hyperlocal"
              label="Hyperlocal" style={{ width: 'auto', marginRight: '10px' }}
            />
          </RadioButtonGroup>
        </div>
        <br />
      </div>
      );
  }
}

export { Objective as Objective };

export default withStyles(s)(connect(state => ({
  user: state.onemedia.loggedInUser,
  campaigns: state.onemedia.activeCampaigns,
  snackBarMessage: state.onemedia.snackBarMessage,
  staticData: state.onemedia.staticData,
  campaign: state.onemedia.objective,
  isEdit: state.onemedia.isEditingCampaign,
}),
{ fetchTargetReach, objectiveFieldChanged, copyFromCampaign })(Objective));
