import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import _ from 'lodash';
import request from 'superagent';
import Loader from './components/loader';
import moment from 'moment';
import Gauge from './components/charts/gauge';

const pollutionLevels = {
  NO2: [{
    levelStart: 0,
    levelEnd: 99,
    title: 'Lite',
    color: 'green'
  },
    {
      levelStart: 100,
      levelEnd: 199,
      title: 'Moderat',
      color: 'yellow'
    },

    {
      levelStart: 200,
      levelEnd: 399,
      title: 'Høyt',
      color: 'orange'
    },

    {
      levelStart: 400,
      levelEnd: 1000,
      title: 'Svært høyt',
      color: 'red'
    }
  ]
};

const MAP_API_KEY = 'AIzaSyAoJnCZd4rGip98-aGDRX0prads8v3R9Qw';

class App extends Component {
  constructor(props) {
    super(props);

    this.handleGetLocationData = this.handleGetLocationData.bind(this);

    this.state = {
      username: '',
      geolocation: null,
      stationdata: null
    }
  }

  componentWillMount() {
    this.getLocation().then((response) => {
      this.setState({geolocation: response});
      this.handleGetLocationData();
    }, (error) => {
      alert(error.message)
    });
  }

  getLocation() {
    return new Promise(function (resolve, reject) {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
          resolve(position);
        });
      } else {
        reject(new Error('geolocation is not available'));
      }
    });
  };

  handleGetLocationData() {
    return new Promise((resolve, reject) => {
      const loc = this.state.geolocation;
      const lat = loc.coords.latitude;
      const long = loc.coords.longitude;
      const url = `http://localhost:5555/stationdata/${lat}/${long}`;
      request
        .get(url)
        .end((err, res) => {
          this.setState({stationdata: res.body})

        }, (err)=> {
          console.log('---------------------------------->');
          console.log('err');
          console.log(err);
          console.log('<----------------------------------');
        });
    });
  };

  handleValueChangeFromInput(key, e) {
    this.handleValueChange(key, e.target.value)
  }

  handleValueChange(key, value) {
    const state = this.state;
    _.set(state, key, value);
    this.setState(state)
  }

  handleUrlKeyPress(e) {
    if (e.charCode === 13 && e.target.value) {
      this.sendMessage();
    }
  }

  renderData() {
    moment.locale('nb');
    const stationdata = this.state.stationdata;
    if (null !== stationdata) {
      moment.locale('nb');
      const name = stationdata[0].Name;
      const airCcomponent = stationdata[0].TimeSeries[0].Component;
      const dataType = stationdata[0].TimeSeries[0].DataType;
      const airComponentValue = stationdata[0].TimeSeries[0].Measurments[0].Value;
      const dateTimeFrom = moment(stationdata[0].TimeSeries[0].Measurments[0].DateTimeFrom).fromNow();
      const dateTimeTo = moment(stationdata[0].TimeSeries[0].Measurments[0].DateTimeTo).fromNow();

      const level = _.pickBy(pollutionLevels[airCcomponent], (levelObj)=> {
        return levelObj.levelStart < airComponentValue && levelObj.levelEnd > airComponentValue
      });

      return (
        <div className="row">
          <span>{name} - {dateTimeTo}</span>
          <br/>
          <span>{airCcomponent}: {airComponentValue}</span>
          <span className={`colorBlock ${level[0].color}`}>&nbsp;</span>
          <br/>
          <Gauge name={name} value={airComponentValue}/>
        </div>
      )
    } else {
      return (
        <span>ikkeno her</span>
      )
    }
  }

  render() {
    const geolocation = this.state.geolocation;

    if (null !== geolocation) {
      const lat = geolocation.coords.latitude;
      const long = geolocation.coords.longitude;
      if (null !== this.state.geolocation) {
        //TODO sjekk på at tjenesten svarer i API
        return (
          <div>
            <span>lokasjon-lat: {lat}</span><br/>
            <span>lokasjon-long: {long}</span><br/>
            <div id="map"></div>
            <br/>
            <br/>
            {this.renderData()}


          </div>
        )
      }
    } else {
      return (
        <Loader/>
      )
    }
  }
}

render(
  <App />, document.getElementById('app'));
