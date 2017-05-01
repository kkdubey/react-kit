import React from 'react';
import s from './UnderConstruction.css';
import withStyles from '../../../node_modules/isomorphic-style-loader/lib/withStyles';
import Card from 'material-ui/Card/Card';
import CardMedia from 'material-ui/Card/CardMedia';

class UnderConstruction extends React.Component { // eslint-disable-line

  render() {
    return (
      <div className={s.root} >
        <section className="section--center mdl-grid mdl-grid--no-spacing mdl-shadow--2dp">
          <Card>
            <CardMedia>
              <img src={require('./underconstruction.jpg')} alt="UnderConstruction" />
            </CardMedia>
          </Card>
        </section>
      </div>
    );
  }
}
export default withStyles(s)(UnderConstruction);

