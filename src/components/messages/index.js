import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Message from '../message';

class Messages extends Component {

  componentDidUpdate() {
    var node = ReactDOM.findDOMNode(this);
    node.scrollTop = node.scrollHeight;
  }

  renderSingleMessage(message, idx) {
    return (
      <li key={idx}>
        <Message>{message}</Message>
      </li>
    )
  }

  render() {
    const { children, cssClasses } = this.props;

    return (
      <ul className={cssClasses}>
        {children.map((child, idx) => {
          return this.renderSingleMessage(child, idx)
        })}
      </ul>
    );
  }
}

Messages.propTypes = {
  children: PropTypes.any,
  classes: PropTypes.string
};

export default Messages;
