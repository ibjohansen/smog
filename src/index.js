import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import Username from './logic/username';
import _ from 'lodash';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      geolocation: '',
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
    const loc = this.state.geolocation;
    const lat = loc.latitude;
    const long = loc.longitude;
    const url = `http://localhost:5555/${lat}/${long}`;
    const stationdata = this.state.stationdata;

    return (
      <div>
        <span>Velkommen til smog {username}</span><br/>
        <span>lokasjon-lat: {lat}</span><br/>
        <span>lokasjon-long: {long}</span><br/>
        <span><a href={url}>hent data</a></span><br/>
        <span>{stationdata}</span>
      </div>
    )
  }
}

render(<App />, document.getElementById('app'));

