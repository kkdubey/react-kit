import React, { PropTypes } from 'react';
import DropZoneComponent from 'react-dropzone-component';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Creative.css';
import { connect } from 'react-redux';
import EditCreatives from '../../EditCreatives/EditCreatives';
import { addCreatives } from '../../../actions/campaign';

class Creative extends React.Component {

  static propTypes = {
    addCreatives: PropTypes.func.isRequired,
  };

  handlesnackBar = (message) => {
    this.setState({ snackBar: { SnackBarOpen: true, SnackBarText: message } });
  };

  completeUploadCallback = (file, data) => {
    if (!data) {
      console.log('Error while saving the data'); // eslint-disable-line no-console
    } else {
      this.props.addCreatives(data.creativeId, data);
    }
  };

  render() {
    return (
      <div>
        <div>
          <EditCreatives />
        </div>
        <div>
          <DropZoneComponent
            config={{
              iconFiletypes: ['.jpg', '.png', '.gif'],
              showFiletypeIcon: true,
              postUrl: '/api/content/creative',
            }}
            eventHandlers={{
              success: this.completeUploadCallback,
            }}
            djsConfig={{
              addRemoveLinks: false,
              acceptedFiles: 'image/jpeg,image/png,image/gif,image/jpg',
              dictRemoveFile: 'Remove',
              dictDefaultMessage: 'Drop your Creatives here! or Click to Upload',
            }}
          />
        </div>
      </div>
    );
  }
}

export { Creative as Creative };

export default withStyles(s)(connect(state => ({
  user: state.onemedia.loggedInUser,
}),
{ addCreatives })(Creative));
