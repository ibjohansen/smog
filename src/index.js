import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import _ from 'lodash';
import request from 'superagent';
import Loader from './components/loader';
import moment from 'moment';
import Gauge from './components/charts/gauge';

//const MAP_API_KEY = 'AIzaSyAoJnCZd4rGip98-aGDRX0prads8v3R9Qw';

const pollutionLevels = {
  descriptions: {
    NO2: {
      title: 'Nitrogendioksid',
      max: '400'
    }
  },
  NO2: [
    {
      levelStart: 0,
      levelEnd: 99,
      title: 'Lite',
      color: 'green',
      icon: 'sentiment_satisfied'
    },
    {
      levelStart: 100,
      levelEnd: 199,
      description: 'Nitrogendioksid',
      title: 'Moderat',
      color: 'yellow',
      icon: 'sentiment_neutral'
    },

    {
      levelStart: 200,
      levelEnd: 399,
      description: 'Nitrogendioksid',
      title: 'Høyt',
      color: 'orange',
      icon: 'sentiment_dissatisfied'
    },

    {
      levelStart: 400,
      levelEnd: 1000,
      description: 'Nitrogendioksid',
      title: 'Svært høyt',
      color: 'red',
      icon: 'sentiment_very_dissatisfied'
    }
  ]
};


class App extends Component {
  constructor(props) {
    super(props);

    this.handleGetLocationData = this.handleGetLocationData.bind(this);

    this.state = {
      username: '',
      geolocation: null,
      stationdata: null,
      type: 'NO2'
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
          console.log(err);
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

  renderIcon(iconString) {
    return (
      <i className="material-icons md-48 md-light">{iconString}</i>
    )
  }

  renderData() {
    moment.locale('nb');
    const stationdata = this.state.stationdata;
    const type = this.state.type;

    if (null !== stationdata) {

      const selectedData = _.pickBy(stationdata.measurments, (data)=> {
        return data.type === type
      });
      moment.locale('nb');
      const name = stationdata.name;
      const airComponentUnit = selectedData[0].unit;
      const airComponentDescription = pollutionLevels.descriptions[selectedData[0].type].title;
      const airComponentMax = pollutionLevels.descriptions[selectedData[0].type].max;
      const airComponentValue = selectedData[0].value;
      const airComponentTrend = selectedData[0].trend;
      const dateTimeTo = moment(selectedData[0].to, 'YYYYMMDDhhmm').fromNow();

      const levelObject = _.pickBy(pollutionLevels[selectedData[0].type], (levelObj)=> {
        return levelObj.levelStart < airComponentValue && levelObj.levelEnd > airComponentValue;
      });

      const trendText = () => {
        const trend = airComponentTrend;
        if (trend > 0) {
          return 'stigende'
        } else if (trend < 0) {
          return 'synkende'
        } else {
          return ''
        }
      };

      return (
        <div className="row">
          <div>smog</div>
          <div>luftforurensningsnivået der du er!</div>
          <div className="location-name">{name} - {dateTimeTo}</div>
          <Gauge name={name} value={airComponentValue} trend={airComponentTrend}/>
          <br/>
          <div>{airComponentDescription}: {Math.round(airComponentValue)} {airComponentUnit} ({trendText()})</div>
          <br/>
          <div>maxverdi: {airComponentMax}</div>

          {this.renderIcon(levelObject[0].icon)}

        </div>
      )
    } else {
      return (
        <Loader/>
      )
    }
  }

  render() {
    const geolocation = this.state.geolocation;
    if (null !== geolocation && null !== this.state.geolocation) {
      return this.renderData();
    } else {
      return (
        <Loader/>
      )
    }
  }
}

render(
  <App />, document.getElementById('app'));
