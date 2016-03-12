import React, { Component, PropTypes } from 'react';

class Gauge extends Component {

  render() {
    const {name, value} = this.props;

    const percentage = value*(100/400);
    return (
      <div>
        <div id="gauge" className="box">
          <div className="mask">
            <div className="semi-circle"></div>
            <div className="semi-circle--mask"></div>
          </div>
        </div>
      </div>
    );
  }
}


Gauge.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired
};

export default Gauge;







