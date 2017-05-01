import React, { PropTypes } from 'react';
import s from './PreviewAd.css';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { connect } from 'react-redux';
import FlatButton from 'material-ui/FlatButton';
import OpenNewButton from 'material-ui/svg-icons/action/open-in-new';
import { previewUrl } from '../../config';

class PreviewAd extends React.Component {

  static propTypes = {
    creatives: PropTypes.arrayOf(React.PropTypes.shape({
      creativeId: React.PropTypes.string,
      cdnUrl: React.PropTypes.string,
      imageHeight: React.PropTypes.string,
      imageWidth: React.PropTypes.string,
    })),
  };

  render() {
    let retval = [];
    this.props.creatives.map((row, index) => {
      const params = `imgSrc=${row.cdnUrl}&imgheight=${row.imageHeight}&imgwidth=${row.imageWidth}`; // eslint-disable-line
      const clickUrl = `${previewUrl}?${params}`;
      retval.push(
        <div>
          <div className={s.flexitem}>
            <img role="presentation" id={index} className={s.imgitem} src={row.cdnUrl} />
          </div>
          <div className={s.addCenter}>
            <a href={clickUrl} target="_blank">
              <OpenNewButton />
              <FlatButton label="Preview Ad" primary />
            </a>
          </div>
        </div>
      );
      return retval;
    });
    return <div className={s.flexcontainer}>{retval}</div>;
  }
}
export { PreviewAd as PreviewAd };
export default withStyles(s)(connect(state => ({
  creatives: state.onemedia.creatives,
}),
  {})(PreviewAd));
