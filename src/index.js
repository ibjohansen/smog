import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import Username from './logic/username';
import _ from 'lodash';
import request from 'superagent';
import Loader from './components/loader';

class App extends Component {
  constructor(props) {
    super(props);

    this.handleGetLocationData = this.handleGetLocationData.bind(this);

    this.state = {
      username: '',
      geolocation: null,
      stationdata: 'data ikke tilgjengelig, trykk hent data'
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
          console.log('---------------------------------->');
          console.log(res.body);
          console.log('<----------------------------------');
          this.setState({stationdata: res.body})
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


  render() {
    const username = this.state.username;
    const geolocation = this.state.geolocation;

    if (null !== geolocation) {
      const lat = geolocation.coords.latitude;
      const long = geolocation.coords.longitude;
      const stationdata = this.state.stationdata || {};
      return (
        <div>
          <span>Velkommen til smog {username}</span><br/>
          <span>lokasjon-lat: {lat}</span><br/>
          <span>lokasjon-long: {long}</span><br/>
          <button type="button" onClick={this.handleGetLocationData}>hent data</button>
          <br/>
          <span>{JSON.stringify(stationdata)}</span><br/>
        </div>
      )
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


 */