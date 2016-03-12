import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import Username from './logic/username';
import _ from 'lodash';
import request from 'superagent';
import Loader from './components/loader';
import moment from 'moment';

class App extends Component {
  constructor(props) {
    super(props);

    this.handleGetLocationData = this.handleGetLocationData.bind(this);

    this.state = {
      username: '',
      geolocation: null,
      stationdata: null //'data ikke tilgjengelig, trykk hent data'
    }
  }

  componentWillMount() {
    const storedName = sessionStorage.getItem('smog-username');
    if (storedName) {
      this.setState({username: storedName});
    } else {
      Username()
        .then((value) => {
            const username = value.data;
            sessionStorage.setItem('smog-username', username);
            this.setState({username});
          },
          (reason) => {
            console.log(reason);
          })
        .catch((error) => {
          console.log(error);
        });
    }

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

        });
    });
  };

  //handleValueChangeFromInput(key, e) {
  //  this.handleValueChange(key, e.target.value)
  //}
  //
  //handleValueChange(key, value) {
  //  const state = this.state;
  //  _.set(state, key, value);
  //  this.setState(state)
  //}
  //
  //handleUrlKeyPress(e) {
  //  if (e.charCode === 13 && e.target.value) {
  //    this.sendMessage();
  //  }
  //}

  renderData() {
    moment.locale('nb');
    const stationdata = this.state.stationdata;
console.log('---------------------------------->');
console.log(stationdata);
console.log('<----------------------------------');

    if (null !== stationdata) {

      const name = stationdata[0].Name;
      const airCcomponent = stationdata[0].TimeSeries[0].Component;
      const dataType = stationdata[0].TimeSeries[0].DataType;
      const airComponentValue = stationdata[0].TimeSeries[0].Measurments[0].Value;
      const dateTimeFrom = moment(stationdata[0].TimeSeries[0].Measurments[0].DateTimeFrom).format();
      const dateTimeTo = moment(stationdata[0].TimeSeries[0].Measurments[0].DateTimeTo).format();
      console.log(dateTimeFrom);
      return (
        <div>
          <span>Målestasjon {name}</span>
          <br/>
          <span>Luftkomponent {airCcomponent}</span>
          <br/>
          <span>Type {dataType}</span>
          <br/>
          <span>Verdi {airComponentValue}</span>
          <span>Tidsrom {dateTimeFrom} {dateTimeTo}</span>
        </div>
      )
    } else {
      return (
        <span>ikkeno her</span>
      )
    }

  }


  render() {
    const username = this.state.username;
    const geolocation = this.state.geolocation;

    if (null !== geolocation) {
      const lat = geolocation.coords.latitude;
      const long = geolocation.coords.longitude;

      if (null !== this.state.geolocation) {

        return (
          <div>
            <span>Velkommen til smog {username}</span><br/>
            <span>lokasjon-lat: {lat}</span><br/>
            <span>lokasjon-long: {long}</span><br/>
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

render(<App />, document.getElementById('app'));

/*

 <span>{stationdata.TimeSeries[0].Measurements[0].Value}</span><br/>
 <span>{airCcomponent}</span>
 <span>{dataType}</span>
 &nbsp;
 <span>{airComponentValue}</span>


 */