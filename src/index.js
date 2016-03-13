import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import _ from 'lodash';
import request from 'superagent';
import Loader from './components/loader';
import moment from 'moment';
import Gauge from './components/charts/gauge';
import Menu from './components/menu';
import classNames from 'classnames';
const apiurl = process.env.NODE_ENV === 'development' ? 'http://localhost:5555/' : 'https://smog-api.herokuapp.com/';

const pollutionLevels = {
  descriptions: {
    NO2: {
      title: 'Nitrogendioksid',
      max: '400'
    },
    "PM2.5": {
      title: 'Svevestøv/partikler',
      max: '150'
    },
    PM10: {
      title: 'Svevestøv/partikler',
      max: '400'
    }

  },
  NO2: [
    {
      levelStart: 0,
      levelEnd: 99,
      description: 'Nitrogendioksid',
      title: 'Lite',
      health: 'Liten eller ingen helserisiko',
      color: 'green',
      icon: 'sentiment_satisfied'
    },
    {
      levelStart: 100,
      levelEnd: 199,
      description: 'Nitrogendioksid',
      title: 'Moderat',
      health: 'Moderat helserisiko',
      color: 'yellow',
      icon: 'sentiment_neutral'
    },

    {
      levelStart: 200,
      levelEnd: 399,
      description: 'Nitrogendioksid',
      title: 'Høyt',
      health: 'Betydelig helserisiko',
      color: 'orange',
      icon: 'sentiment_dissatisfied'
    },

    {
      levelStart: 400,
      levelEnd: 1000,
      description: 'Nitrogendioksid',
      title: 'Svært høyt',
      health: 'Alvorlig helserisiko',
      color: 'red',
      icon: 'sentiment_very_dissatisfied'
    }
  ],

  "PM2.5": [
    {
      levelStart: 0,
      levelEnd: 24,
      description: 'Svevestøv/partikler',
      title: 'Lite',
      health: 'Liten eller ingen helserisiko',
      color: 'green',
      icon: 'sentiment_satisfied'
    },
    {
      levelStart: 25,
      levelEnd: 39,
      description: 'Svevestøv/partikler',
      title: 'Moderat',
      health: 'Moderat helserisiko',
      color: 'yellow',
      icon: 'sentiment_neutral'
    },

    {
      levelStart: 40,
      levelEnd: 149,
      description: 'Svevestøv/partikler',
      title: 'Høyt',
      health: 'Betydelig helserisiko',
      color: 'orange',
      icon: 'sentiment_dissatisfied'
    },

    {
      levelStart: 150,
      levelEnd: 1000,
      description: 'Svevestøv/partikler',
      title: 'Svært høyt',
      health: 'Alvorlig helserisiko',
      color: 'red',
      icon: 'sentiment_very_dissatisfied'
    }
  ],

  PM10: [
    {
      levelStart: 0,
      levelEnd: 24,
      description: 'Svevestøv/partikler',
      title: 'Lite',
      health: 'Liten eller ingen helserisiko',
      color: 'green',
      icon: 'sentiment_satisfied'
    },
    {
      levelStart: 25,
      levelEnd: 39,
      description: 'Svevestøv/partikler',
      title: 'Moderat',
      health: 'Moderat helserisiko',
      color: 'yellow',
      icon: 'sentiment_neutral'
    },

    {
      levelStart: 40,
      levelEnd: 149,
      description: 'Svevestøv/partikler',
      title: 'Høyt',
      health: 'Betydelig helserisiko',
      color: 'orange',
      icon: 'sentiment_dissatisfied'
    },

    {
      levelStart: 150,
      levelEnd: 1000,
      description: 'Svevestøv/partikler',
      title: 'Svært høyt',
      health: 'Alvorlig helserisiko',
      color: 'red',
      icon: 'sentiment_very_dissatisfied'
    }
  ]
};


class App extends Component {
  constructor(props) {
    super(props);

    this.handleGetLocationData = this.handleGetLocationData.bind(this);
    this.onSelectStation = this.onSelectStation.bind(this);
    this.handleSetType = this.handleSetType.bind(this);

    this.state = {
      geolocation: null,
      stationdata: null,
      type: 'NO2',
      error: ''
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
      const url = `${apiurl}stationdata/${lat}/${long}`;
      request
        .get(url)
        .end((err, res) => {
          this.setState({stationdata: res.body})

        }, (err)=> {
          console.log(err);
        });
    });
  };

  handleSetType(e) {
    const type = e.target.getAttribute('data-type');
    this.setState({type});
  }

  renderIcon(iconString) {
    return (
      <i className="material-icons md-48 md-light">{iconString}</i>
    )
  }

  renderError() {
    return (
      <span>{this.state.error}</span>
    )
  }

  onSelectStation(station) {
    this.setState({stationdata: station})
  }

  mapMeasurements(measurementsArray) {
    let measurementsObject = {};
    measurementsArray.forEach((mo)=> {
      measurementsObject[mo.type] = mo;
    });
    return measurementsObject;
  }

  renderData() {
    moment.locale('nb');
    const stationdata = this.state.stationdata;
    let type = this.state.type;

    if (stationdata) {

      let measurementsObject = this.mapMeasurements(stationdata.measurments);
      let selectedData = measurementsObject[type];

      if (_.isEmpty(selectedData)) {
        console.log('HUFFAMEI');
        this.renderError('finner ikke data på stasjonen');
        selectedData = [stationdata.measurments[0]];
        type = selectedData.type;
      } else {
        this.renderError('');
      }

      moment.locale('nb');
      const name = stationdata.name;
      const airComponentUnit = selectedData.unit;
      const airComponentDescription = pollutionLevels.descriptions[selectedData.type].title;
      const airComponentMax = pollutionLevels.descriptions[selectedData.type].max;
      const airComponentValue = selectedData.value;
      const airComponentTrend = selectedData.trend;
      const dateTimeTo = moment(selectedData.to, 'YYYYMMDDhhmm').fromNow();

      let hasNO2 = false;
      let hasPM2 = false;
      let hasPM10 = false;

      _(stationdata.measurments).forEach(function (o) {
        if (o.type === 'NO2') {
          hasNO2 = true;
        } else if (o.type === 'PM2.5') {
          hasPM2 = true;
        } else if (o.type === 'PM10') {
          hasPM10 = true;
        }
      });

      const levelObject = _.find(pollutionLevels[selectedData.type], (levelObj)=> {
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
      const btnClassesNO2 = classNames('button', 'raised', {hidden: !hasNO2});
      const btnClassesPM2 = classNames('button', 'raised', {hidden: !hasPM2});
      const btnClassesPM10 = classNames('button', 'raised', {hidden: !hasPM10});

      return (
        <div className="row">
          <Menu onSelectStation={this.onSelectStation} url={apiurl}/>
          <div className="app-name">smog</div>
          <div className="app-splash">luftforurensningsnivået der du er!</div>
          <br/>
          <div className="location-name">{name} - {dateTimeTo}</div>
          <Gauge name={name} value={airComponentValue} max={airComponentMax} trend={airComponentTrend}/>
          <br/>
          <div>{airComponentDescription}: {Math.round(airComponentValue)} {airComponentUnit} ({trendText()})</div>
          <br/>
          <div>maxverdi: {airComponentMax}</div>


          {this.renderIcon(levelObject.icon)}
          {this.renderError()}


          <br/>
          <div className="btn-bar">


            <div className={btnClassesNO2} onClick={this.handleSetType} data-type="NO2">
              <div className="center" data-type="NO2">NO2</div>
            </div>

            <div className={btnClassesPM2} onClick={this.handleSetType} data-type="PM2.5">
              <div className="center" data-type="PM2.5">PM2,5</div>
            </div>

            <div className={btnClassesPM10} onClick={this.handleSetType} data-type="PM10">
              <div className="center" data-type="PM10">PM10</div>
            </div>
          </div>

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
