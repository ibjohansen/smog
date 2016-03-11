import React, { Component, PropTypes } from 'react';
import { ACTION_MESSAGE, ACTION_JOINED, ACTION_CONNECTED } from '../../consts';
import moment from 'moment';

class Message extends Component {

  renderMessage(messageData) {
    if (messageData.name) {

      moment.locale('nb');

      let messageObject = {
        timestamp: moment(messageData.at).format('LTS'),
        username: messageData.name,
        message: messageData.message
      };

      if (messageData.action === ACTION_MESSAGE) {
        return (
          <span>
            <span className="message-timestamp">{messageObject.timestamp}</span>
            <span className="message-name">{messageObject.username}:</span>
            <span className="message-message">{messageObject.message}</span>
          </span>
        )
      } else if (messageData.action === ACTION_JOINED) {
        messageObject.message = 'joined';
        return (
          <span>
            <span className="message-timestamp">{messageObject.timestamp}:</span>
            <span className="message-name">{messageObject.username}</span>
            <span className="message-message">joined</span>
          </span>
        )
      } else if (messageData.action === ACTION_CONNECTED) {
        return (
          <span>
            <span className="message-timestamp">{messageObject.timestamp}:</span>
            <span className="message-message">{`Welcome ${messageObject.username}!`}</span>
          </span>
        )
      }
    }
  }

  render() {
    const { children, cssClasses } = this.props;
    return (
      <div className={cssClasses}>
        {this.renderMessage(children)}
      </div>
    );
  }
}

Message.propTypes = {
  children: PropTypes.any,
  cssClasses: PropTypes.string
};

export default Message;
