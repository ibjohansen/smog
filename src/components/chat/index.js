import React, { Component, PropTypes } from 'react';
class Chat extends Component {

  render() {
    const {children, cssClasses, username, channelName } = this.props;
    return (
      <div className={cssClasses}>
        <span className="text-m">{`Talking in ${channelName} as ${username}`}</span>
        {children}
      </div>
    );
  }
}

Chat.propTypes = {
  children: PropTypes.any,
  cssClasses: PropTypes.string
};

export default Chat;
