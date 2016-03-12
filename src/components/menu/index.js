import React, { Component } from 'react';
import request from 'superagent';

class Menu extends Component {

  constructor(props) {
    super(props);
    this.state = {
      stations: [],
      open: false
    }
  }

  toggleMenu() {
    if (this.state.stations.length == 0) return this.loadStations();
    this.setState({open: !this.state.open})
  }

  loadStations() {
    const url = `http://localhost:5555/allStationData`;
    request
      .get(url)
      .end((err, res) => {
        const stations = res.body;
        var loadedStations = [];
        for (var i = 0; i < stations.length; i++) {
          loadedStations.push(stations[i]);
        }
        this.setState({stations: loadedStations, open: true})
      }, (err)=> {
        console.log(err);
      });
  }

  selectStation(station) {
    this.props.onSelectStation(station);
    this.toggleMenu()
  }

  render() {
    var _this = this;
    let stations = this.state.stations.map(function(e) {
      return (<li onClick={_this.selectStation.bind(_this, e)} key={e.id}>{e.name}</li>);
    });

    return (
      <div className="menu">
        <button className={this.state.open ? "c-hamburger c-hamburger--htx is-active"  : "c-hamburger c-hamburger--htx" } onClick={this.toggleMenu.bind(this)}>
          <span>toggle menu</span>
        </button>
        <div className={this.state.open ? "menuContainer visible" : "menuContainer"}>
          <ul>{stations}</ul>
        </div>
      </div>
    );
  }
}

export default Menu;

