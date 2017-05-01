import React, { PropTypes } from 'react';
import ClearIcon from 'material-ui/svg-icons/navigation/cancel';
import { removeCreative } from '../../actions/campaign';
import { connect } from 'react-redux';
import s from './RemoveCreative.css';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

class RemoveCreative extends React.Component {

  static propTypes = {
    removeCreative: PropTypes.func.isRequired,
    creative: PropTypes.shape({
      _id: React.PropTypes.string,
      cdnUrl: React.PropTypes.string,
      imageHeight: React.PropTypes.string,
      imageWidth: React.PropTypes.string,
    }),
  };

  constructor(props) {
    super(props);
    this.state = {
      creative: props.creative,
    };
  }

  removeOneCreative = () => {
    this.props.removeCreative(this.state.creative);
  };

  render() {
    const retval = (
      <div>
        <ClearIcon style={s.imageclose} onTouchTap={this.removeOneCreative} />
      </div>
    );
    return retval;
  }
}

export { RemoveCreative as RemoveCreative };

export default withStyles(s)(connect(() => ({}), { removeCreative })(RemoveCreative));
