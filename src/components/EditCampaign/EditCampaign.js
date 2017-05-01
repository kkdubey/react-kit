import React from 'react';
import RaisedButton from 'material-ui/RaisedButton/RaisedButton';
import Location from '../../core/history';
import { connect } from 'react-redux';
import { editCampaign } from '../../actions/campaign';

class EditCampaign extends React.Component {
  static propTypes = {
    campaign: React.PropTypes.object,
    disableFeatures: React.PropTypes.bool,
    editCampaign: React.PropTypes.func.isRequired,
    user: React.PropTypes.shape({
      user: React.PropTypes.shape({
        _id: React.PropTypes.string,
      }),
    }),
  };

  handleEdit = () => {
    this.props.editCampaign(this.props.campaign);
    Location.push({
      pathname: '/NewCampaign',
    });
  };

  render() {
    let retval;
    if (this.props.disableFeatures) {
      retval = (
        <div >
          <RaisedButton
            label="Edit"
            primary
            disabled
            onTouchTap={this.handleEdit}
          />
        </div>
      );
    } else {
      retval = (
        <div >
          <RaisedButton
            label="Edit"
            primary
            onTouchTap={this.handleEdit}
          />
        </div>
      );
    }

    return retval;
  }
}

export { EditCampaign as EditCampaign };

export default (connect(state => ({
  user: state.onemedia.loggedInUser,
  disableFeatures: state.onemedia.disableFeatures,
}),
{ editCampaign })(EditCampaign));
