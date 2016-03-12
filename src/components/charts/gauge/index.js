import React, { Component, PropTypes } from 'react';

class Gauge extends Component {

  constructor(props) {
    super(props);
    this.state = {
      percentage: 0,
      max: this.props.max
    };
  }

  componentDidMount() {
    const {value } = this.props;
    const percentage = (value * 100) / this.state.max;
    const percentageOfHalfcircle = (percentage * 180) / 100;

    setTimeout(() => {
      this.setState({percentage: percentageOfHalfcircle})
    }, 750);
  }

  renderTrendIcon() {
    const trend = this.props.trend;
    if (trend > 0) {
      return <i className="material-icons md-48 md-light">arrow_upward</i>
    } else if (trend < 0) {
      return <i className="material-icons md-48 md-light">arrow_downward</i>
    } else {
      return <span />
    }
  }

  render() {
    const percentageClass = {transform: `rotate(${this.state.percentage}deg)`};
    return (
      <div>
        <div id="gauge" className="box">
          {this.renderTrendIcon()}
          <div className="mask">
            <div className="semi-circle"></div>
            <div className="semi-circle--mask" style={percentageClass}></div>
          </div>
        </div>
      </div>
    );
  }
}


Gauge.propTypes = {
  value: PropTypes.number.isRequired
};

export default Gauge;







