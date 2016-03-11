import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import Chat from './components/chat';
import Messages from './components/messages';
import Message from './components/message';
import Button from './components/button';
import Username from './logic/username';
import {ACTION_INIT, ACTION_MESSAGE} from './consts';
import _ from 'lodash';

const appContainer = document.getElementById('app');
const channelId = appContainer.getAttribute('data-channel');
const userId = appContainer.getAttribute('data-user-id');
const username = appContainer.getAttribute('data-user-name');

let ws;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      messages: [],
      inputMessage: ''
    }
  }

  componentWillMount() {
    const storedName = sessionStorage.getItem('emb-chat-username');
    if (storedName) {
      this.setState({username: storedName});
      this.initSockets(storedName);
    } else {

      if (this.props.username) {

        //todo set userid & username from props in a better way

        this.setState({username: this.props.username});
        this.setState({userId: this.props.username});
        this.initSockets(this.props.username);
      } else {
        Username()
          .then((value) => {
              const username = value.data;
              sessionStorage.setItem('emb-chat-username', username);
              this.setState({username});
              this.initSockets(username);
            },
            (reason) => {
              console.log(reason);
            })
          .catch((error) => {
            console.log(error);
          });
      }
    }
  }

  // TODO: Remove username as it's set by component?
  initSockets(username) {
    var host = "localhost:8080";
    ws = new WebSocket("ws://" + host + "/echo");

    ws.onopen = () => {
      var message = {
        channel: this.props.channel,
        userId: this.props.userId,
        name: this.state.username,
        action: ACTION_INIT
      };
      ws.send(JSON.stringify(message));
    };

    ws.onmessage = (e) => {
      addMessage(JSON.parse(e.data));
    };

    const addMessage = (msg, type) => {
      let messageArray = this.state.messages;
      if (msg.log && msg.log.length > 0) {
        for (var i = 0; i < msg.log.length; i++) {
          messageArray.push(msg.log[i]);
        }
      }

      messageArray.push(msg);
      this.setState({messages: messageArray})
    }
  }

  sendMessage() {
    if (!this.state.inputMessage) {
      return;
    }

    var messageData = {
      channel: this.props.channel,
      userId: this.state.userId,
      name: this.state.username,
      message: this.state.inputMessage,
      action: ACTION_MESSAGE
    };
    var stringData = JSON.stringify(messageData);
    ws.send(stringData);
    this.handleValueChange('inputMessage', '')
  }

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
    return (
      <div>hello verden</div>
    )
  }
}

render(<App channel={channelId} userId={userId} username={username}/>, appContainer);

