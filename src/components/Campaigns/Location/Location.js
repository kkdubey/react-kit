import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Location.css';
import Toolbar from 'material-ui/Toolbar/Toolbar';
import ToolbarGroup from 'material-ui/Toolbar/ToolbarGroup';
import ToolbarSeparator from 'material-ui/Toolbar/ToolbarSeparator';
import ToolbarTitle from 'material-ui/Toolbar/ToolbarTitle';
import SelectField from 'material-ui/SelectField/SelectField';
import MenuItem from 'material-ui/MenuItem/MenuItem';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import Subheader from 'material-ui/Subheader';
import AddCityIcon from 'material-ui/svg-icons/content/add-circle-outline';
import AutoComplete from 'material-ui/AutoComplete/AutoComplete';
import fetch from '../../../core/fetch';
import IconButton from 'material-ui/IconButton/IconButton';
import Paper from 'material-ui/Paper/Paper';
import generatePassword from 'password-generator';
import Snackbar from 'material-ui/Snackbar/Snackbar';
import { connect } from 'react-redux';
import { locationFieldSimpleChange, locationFieldArrayChange, addMarker, removeMarker }
from '../../../actions/campaign';
import { default as FaSpinner } from 'react-icons/lib/fa/spinner';
import { default as ScriptjsLoader } from 'react-google-maps/lib/async/ScriptjsLoader';
import { GoogleMap, Marker, InfoWindow } from 'react-google-maps';
import Chip from 'material-ui/Chip';
import { defaultLocation, googleMapsKey } from '../../../config';

class Location extends React.Component {
  static propTypes = {
    location: React.PropTypes.shape({
      cities: React.PropTypes.array,
      locationInclude: React.PropTypes.bool,
      markers: React.PropTypes.array,
    }).isRequired,
    objective: React.PropTypes.shape({
      campaign_name: React.PropTypes.string,
      campaign_brand_category: React.PropTypes.string,
      campaign_objective: React.PropTypes.string,
      campaign_type: React.PropTypes.string,
    }).isRequired,
    locationFieldSimpleChange: PropTypes.func.isRequired,
    locationFieldArrayChange: PropTypes.func.isRequired,
    addMarker: PropTypes.func.isRequired,
    removeMarker: PropTypes.func.isRequired,
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
      dataSource: [],
      searchText: '',
      locationText: '',
      snackBar: {
        SnackBarOpen: false,
        SnackBarText: '',
      },
      markers: [{
        position: {
          lat: defaultLocation.lat,
          lng: defaultLocation.lng,
        },
        key: Date.now(),
        defaultAnimation: 2,
        radius: '',
      }],
    };
  }

  handleUpdateInput = async (value) => {
    if (value.length >= 3) {
      const random = generatePassword(12, false);
      const url = `/api/static/location/search/?kword=${value}&limitResults=20&requestId=${random}`;
      const response = await fetch(url);
      const locations = await response.json();
      const oodata = [];
      if (locations.status === 'OK') {
        locations.results.map((location) => (
          oodata.push(location.name)
        ));
        this.setState({
          dataSource: oodata,
        });
      }
    }
  };

  handleCityIsIncludeChange = (event, index, value) => {
    if (value === 'include') {
      this.props.locationFieldSimpleChange('locationInclude', true);
    } else {
      this.props.locationFieldSimpleChange('locationInclude', false);
    }
  };

  handleChipRemove = (chip) => {
    this.props.locationFieldArrayChange('cities', chip, false);
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

  handleOnNewRequest = (chosenRequest) => {
    if (this.arrayHasElement(this.props.location.cities, chosenRequest)) {
      this.handlesnackBar(`${chosenRequest} is already added in the cities list.`);
    } else if (!this.arrayHasElement(this.state.dataSource, chosenRequest)) {
      this.handlesnackBar(`${chosenRequest} is not in list.`);
    } else {
      this.props.locationFieldArrayChange('cities', chosenRequest, true);
    }
  };

  addCities = (city) => {
    if (this.arrayHasElement(this.props.location.cities, city)) {
      this.handlesnackBar(`${city} is already added in the cities list.`);
    } else {
      this.props.locationFieldArrayChange('cities', city, true);
    }
  };

  handleNorthernRegion = () => {
    this.addCities('Northern States');
  };

  handlesnackBar = (message) => {
    this.setState({ snackBar: { SnackBarOpen: true, SnackBarText: message } });
  };

  handleRequestClose = () => {
    this.setState({ snackBar: { SnackBarOpen: false, SnackBarText: '' } });
  };

  handleSothernRegion = () => {
    this.addCities('Southern States');
  };

  handleWesternRegion = () => {
    this.addCities('Western States');
  };

  handleEsternRegion = () => {
    this.addCities('Eastern States');
  };

  handleNorthEnsternRegion = () => {
    this.addCities('North Eastern States');
  };

  handleTier1Region = () => {
    this.addCities('Tier 1 Cities');
  };

  handleTier2Region = () => {
    this.addCities('Tier 2 Cities');
  };

  isLocationEnabled = () => {
    let retval;
    if (this.props.objective.campaign_type !== 'Hyperlocal') {
      retval = s.displaynone;
    }

    return retval;
  }

  isCitiesEnabled = () => {
    let retval;
    if (this.props.objective.campaign_type === 'Hyperlocal') {
      retval = s.displaynone;
    }

    return retval;
  }
  /*
   * This is called when you click on the map.
   * Go and try click now.
   */
  handleMapClick = (event) => {
    const marker = {
      position: {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      },
      defaultAnimation: 2,
      key: Date.now(), // Add a key property for: http://fb.me/react-warning-keys
      showInfo: false,
      radius: '',
    };
    this.props.addMarker(marker);
    this.handlesnackBar('Right click on the marker to remove it');
  };

  renderInfoWindow(ref, marker) {
    return (
      <InfoWindow
        key={`${ref}_info_window`}
        onCloseclick={() => {
          marker.showInfo = false; // eslint-disable-line
          this.setState(this.props.location.markers);
        }}
      >
        <div>
          <strong>{marker.content}</strong>
          <br />
          <em>Enter Radius.</em>
          <br />
          <input
            type="number"
            value={marker.radius}
            onChange={(event) => {
              marker.radius = event.target.value; // eslint-disable-line
              marker.showInfo = true; // eslint-disable-line
              this.props.removeMarker(marker);
              this.props.addMarker(marker);
              this.setState(this.props.location.markers);
            }}

          />
        </div>
      </InfoWindow>
    );
  }

  render() {
    return (
      <div className={s.container}>
        <div>Location </div>
        <div>
          <div className={this.isCitiesEnabled()}>
            <Toolbar>
              <ToolbarGroup>
                <ToolbarTitle text="Tip" />
                <ToolbarSeparator />
                <span className={s.tipText}>Enter city or select grouping from list below
                </span>
              </ToolbarGroup>
            </Toolbar>
            {this.props.location.cities.map((row, index) => (
              <Chip
                key={index}
                style={s.chipstyles}
                onRequestDelete={() => this.handleChipRemove(row)}
              >{row}</Chip>
              ))}
            <AutoComplete
              hintText="Type Location"
              searchText={this.state.searchText}
              dataSource={this.state.dataSource}
              onUpdateInput={this.handleUpdateInput}
              onNewRequest={this.handleOnNewRequest}
              value={this.state.locationText}
              filter={AutoComplete.caseInsensitiveFilter}
            />
            <div className="section">
              <SelectField
                value={this.props.location.locationInclude ? 'include' : 'exclude'}
                onChange={this.handleCityIsIncludeChange}
              >
                <MenuItem value="include" primaryText="include" />
                <MenuItem value="exclude" primaryText="exclude" />
              </SelectField>
            </div>
            <Paper zDepth={1} className={s.region} >
              <List>
                <Subheader>Region Groupings</Subheader>
                <ListItem
                  primaryText="Northern States"
                  rightIconButton={
                    <IconButton tooltip="Add Region" onTouchTap={this.handleNorthernRegion}>
                      <AddCityIcon />
                    </IconButton>
                  }
                />
                <ListItem
                  primaryText="Southern States"
                  rightIconButton={
                    <IconButton tooltip="Add Region" onTouchTap={this.handleSothernRegion}>
                      <AddCityIcon />
                    </IconButton>
                  }
                />
                <ListItem
                  primaryText="Western States"
                  rightIconButton={
                    <IconButton tooltip="Add Region" onTouchTap={this.handleWesternRegion}>
                      <AddCityIcon />
                    </IconButton>
                  }
                />
                <ListItem
                  primaryText="Eastern States"
                  rightIconButton={
                    <IconButton tooltip="Add Region" onTouchTap={this.handleEsternRegion}>
                      <AddCityIcon />
                    </IconButton>
                  }
                />
                <ListItem
                  primaryText="North Eastern States"
                  rightIconButton={
                    <IconButton tooltip="Add Region" onTouchTap={this.handleNorthEnsternRegion}>
                      <AddCityIcon />
                    </IconButton>
                  }
                />
                <ListItem
                  primaryText="Tier 1 Cities"
                  rightIconButton={
                    <IconButton tooltip="Add Region" onTouchTap={this.handleTier1Region}>
                      <AddCityIcon />
                    </IconButton>
                  }
                />
                <ListItem
                  primaryText="Tier 2 Cities"
                  rightIconButton={
                    <IconButton tooltip="Add Region" onTouchTap={this.handleTier2Region}>
                      <AddCityIcon />
                    </IconButton>
                  }
                />
              </List>
            </Paper>
          </div>
          <br />
          <div className={this.isLocationEnabled()}>
            <Toolbar>
              <ToolbarGroup>
                <ToolbarTitle text="Tip" />
                <ToolbarSeparator />
                <span className={s.tipText}>Tap on map.
                </span>
              </ToolbarGroup>
            </Toolbar>
            <div className={s.hyperlocal}>
              <ScriptjsLoader
                hostname={'maps.googleapis.com'}
                pathname={'/maps/api/js'}
                query={{
                  key: googleMapsKey,
                  libraries: 'geometry,drawing,places',
                }}
                loadingElement={
                  <div {...this.props} style={{ height: '100%' }}>
                    <FaSpinner
                      style={{
                        display: 'block',
                        width: 200,
                        height: 200,
                        margin: '100px auto',
                        animation: 'fa-spin 2s infinite linear',
                      }}
                    />
                  </div>
                }
                containerElement={
                  <div {...this.props} style={{ height: '100%' }} />
                }
                googleMapElement={
                  <GoogleMap
                    ref={googleMap => {
                      if (!googleMap) {
                        return;
                      }
                    }}

                    defaultZoom={9}
                    defaultCenter={{ lat: defaultLocation.lat, lng: defaultLocation.lng }}
                    onClick={::this.handleMapClick}
                  >
                    {this.props.location.markers.map((marker, index) => {
                      const ref = `marker_${index}`;
                      return (
                        <Marker
                          key={ref} ref={ref}
                          {...marker}
                          onRightclick={() => {
                            const _marker = this.props.location.markers[index];
                            this.props.removeMarker(_marker);
                            this.setState(this.props.location.markers);
                          }}

                          onClick={() => {
                            marker.showInfo = true; // eslint-disable-line
                            this.setState(this.state.markers);
                          }}
                        >
                          {marker.showInfo ? this.renderInfoWindow(ref, marker) : null}
                        </Marker>
                      );
                    })}
                  </GoogleMap>
                }
              />
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

export { Location as Location };

export default withStyles(s)(connect(state => ({
  staticData: state.onemedia.staticData,
  location: state.onemedia.location,
  objective: state.onemedia.objective,
}),
{ locationFieldSimpleChange, locationFieldArrayChange, addMarker, removeMarker })(Location));
