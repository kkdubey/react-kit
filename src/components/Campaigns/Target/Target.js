import React, { PropTypes } from 'react';
import RadioButton from 'material-ui/RadioButton/RadioButton';
import RadioButtonGroup from 'material-ui/RadioButton/RadioButtonGroup';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Target.css';
import Checkbox from 'material-ui/Checkbox/Checkbox';
import SelectField from 'material-ui/SelectField/SelectField';
import MenuItem from 'material-ui/MenuItem/MenuItem';
import AutoComplete from 'material-ui/AutoComplete/AutoComplete';
import generatePassword from 'password-generator';
import Snackbar from 'material-ui/Snackbar/Snackbar';
import { connect } from 'react-redux';
import { targetFieldSimpleChange, targetFieldArrayChange } from '../../../actions/campaign';
import Chip from 'material-ui/Chip';

const INTEREST_OPTIONS = ['Shopping', 'Travel', 'News',
  'Music', 'Interior', 'Biz', 'biz', 'Social'];

class Target extends React.Component {
  static propTypes = {
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
    targetFieldSimpleChange: PropTypes.func.isRequired,
    targetFieldArrayChange: PropTypes.func.isRequired,
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
      tagText: '',
      websiteText: '',
      tagDataSource: [],
      websiteDataSource: [],
      snackBar: {
        SnackBarOpen: false,
        SnackBarText: '',
      },
    };
  }

  handlesnackBar = (message) => {
    this.setState({ snackBar: { SnackBarOpen: true, SnackBarText: message } });
  };

  handleRequestClose = () => {
    this.setState({ snackBar: { SnackBarOpen: false, SnackBarText: '' } });
  };

  handleTagAdded = (chosenRequest) => {
    if (this.arrayHasElement(this.props.target.tags, chosenRequest)) {
      this.handlesnackBar(`${chosenRequest} is already added in the tags list.`);
    } else if (!this.arrayHasElement(this.state.tagDataSource, chosenRequest)) {
      this.handlesnackBar(`${chosenRequest} is not in list.`);
    } else {
      this.props.targetFieldArrayChange('tags', chosenRequest, true);
    }
  };

  handleWebsiteAdded = (chosenRequest) => {
    if (this.arrayHasElement(this.props.target.websites, chosenRequest)) {
      this.handlesnackBar(`${chosenRequest} is already added in the websites list.`);
    } else {
      this.props.targetFieldArrayChange('websites', chosenRequest, true);
    }
  };

  handleTagUpdateInput = async (value) => {
    if (value.length >= 3) {
      const random = generatePassword(12, false);
      const url = `/api/static/tags/search/?kword=${value}&limitResults=20&requestId=${random}`;
      try {
        const response = await fetch(url);
        const tagsFetched = await response.json();
        const tData = [];
        if (tagsFetched.status === 'OK') {
          tagsFetched.results.map((tag) => (
            tData.push(tag.name)
          ));
          this.setState({
            tagDataSource: tData,
          });
        }
      } catch (error) {
        console.log('error', error);
      }
    }
  };

  handleTagChipRemove = (tag) => {
    this.props.targetFieldArrayChange('tags', tag, false);
  };

  handleGenderChange = (event, value) => {
    this.props.targetFieldSimpleChange('gender', value);
  };

  handleInterestIsIncludeChange = (event, index, value) => {
    if (value === 'include') {
      this.props.targetFieldSimpleChange('interestsInclude', true);
    } else {
      this.props.targetFieldSimpleChange('interestsInclude', false);
    }
  };

  handleWebsitesIsIncludeChange = (event, index, value) => {
    if (value === 'include') {
      this.props.targetFieldSimpleChange('webSitesInclude', true);
    } else {
      this.props.targetFieldSimpleChange('webSitesInclude', false);
    }
  };

  handleTagsIsIncludeChange = (event, index, value) => {
    if (value === 'include') {
      this.props.targetFieldSimpleChange('tagsInclude', true);
    } else {
      this.props.targetFieldSimpleChange('tagsInclude', false);
    }
  };

  arrayHasElement = (array, element) => {
    let retval = false;
    if (array.indexOf(element) === -1) {
      retval = false;
    } else {
      retval = true;
    }

    return retval;
  };

  handleInterestChipRemove = (interest) => {
    this.props.targetFieldArrayChange('interests', interest, false);
  };

  handleInterestAdded = (chosenRequest) => {
    if (this.arrayHasElement(this.props.target.interests, chosenRequest)) {
      this.handlesnackBar(`${chosenRequest} is already added in the interests list.`);
    } else {
      this.props.targetFieldArrayChange('interests', chosenRequest, true);
    }
  };

  handleWebsiteChipRemove = (website) => {
    this.props.targetFieldArrayChange('websites', website, false);
  };

  render() {
    return (
      <div className={s.container}>
        <div>
          <span>Gender</span>
          <RadioButtonGroup
            name="gender" valueSelected={this.props.target.gender}
            onChange={this.handleGenderChange}
          >
            <RadioButton value="all" label="All" />
            <RadioButton value="male" label="Male" />
            <RadioButton value="female" label="Female" />
          </RadioButtonGroup>
          <div>Age Group</div>
            {this.props.staticData.get('age_group').map((ag, index) => (
              <Checkbox
                id={`ag-${index}`} key={`ag-${index}`} label={ag}
                defaultChecked={this.arrayHasElement(this.props.target.agegroup, ag)}
                onCheck={(ev, checked) => {
                  this.props.targetFieldArrayChange('agegroup', ag, checked);
                }}

              />
            ))}
          <div>Income Group</div>
            {this.props.staticData.get('income_group').map((ig, index) => (
              <Checkbox
                id={`ig-${index}`} key={`ig-${index}`} label={ig}
                defaultChecked={this.arrayHasElement(this.props.target.income_group, ig)}
                onCheck={(ev, checked) => {
                  this.props.targetFieldArrayChange('income_group', ig, checked);
                }}

              />
            ))}
          <div>Interest </div>
          <div className="section">
            {this.props.target.interests.map((interest, index) => (
              <Chip
                key={index}
                style={s.chipstyles}
                onRequestDelete={() => this.handleInterestChipRemove(interest)}
              >{interest}
              </Chip>
              ))}
            <AutoComplete
              hintText="Interest"
              dataSource={INTEREST_OPTIONS}
              onNewRequest={this.handleInterestAdded}
              filter={AutoComplete.caseInsensitiveFilter}
            />
            <div className={s.tags1}>
              <SelectField
                searchText={this.state.interestSearchText}
                value={this.props.target.interestsInclude ? 'include' : 'exclude'}
                onChange={this.handleInterestIsIncludeChange}
              >
                <MenuItem value="include" primaryText="include" />
                <MenuItem value="exclude" primaryText="exclude" />
              </SelectField>
            </div>
          </div>
          <div>Tags</div>
          {this.props.target.tags.map((tag, index) => (
            <Chip
              key={index}
              style={s.chipstyles}
              onRequestDelete={() => this.handleTagChipRemove(tag)}
            >{tag}
            </Chip>
          ))}
          <div className="section">
            <div className={s.tags1}>
              <AutoComplete
                hintText="Type tags"
                dataSource={this.state.tagDataSource}
                onUpdateInput={this.handleTagUpdateInput}
                onNewRequest={this.handleTagAdded}
                searchText={this.state.tagText}
              />
              <SelectField
                value={this.props.target.tagsInclude ? 'include' : 'exclude'}
                onChange={this.handleTagsIsIncludeChange}
              >
                <MenuItem value="include" primaryText="include" />
                <MenuItem value="exclude" primaryText="exclude" />
              </SelectField>
            </div>
          </div>
          <div>Web Sites </div>
          {this.props.target.websites.map((website, index) => (
            <Chip
              key={index}
              style={s.chipstyles}
              onRequestDelete={() => this.handleWebsiteChipRemove(website)}
            >{website}
            </Chip>
          ))}
          <div className="section">
            <div className={s.tags1}>
              <AutoComplete
                hintText="Type website"
                dataSource={this.state.websiteDataSource}
                onNewRequest={this.handleWebsiteAdded}
                searchText={this.state.websiteText}
              />
              <SelectField
                value={this.props.target.webSitesInclude ? 'include' : 'exclude'}
                onChange={this.handleWebsitesIsIncludeChange}
              >
                <MenuItem value="include" primaryText="include" />
                <MenuItem value="exclude" primaryText="exclude" />
              </SelectField>
            </div>
          </div>
        </div>
        <Snackbar
          className={s.snackbarStyle}
          open={this.state.snackBar.SnackBarOpen}
          message={this.state.snackBar.SnackBarText}
          autoHideDuration={4000}
          onRequestClose={this.handleRequestClose}
        />
      </div>
      );
  }
}

export { Target as Target };

export default withStyles(s)(connect(state => ({
  staticData: state.onemedia.staticData,
  target: state.onemedia.target,
}),
{ targetFieldSimpleChange, targetFieldArrayChange })(Target));
