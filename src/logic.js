import consts from './logic';
import Message from './components/message';

export const init = (channel, userid, name) => {
  /** setup websocket */
  var ws = new WebSocket("ws://" + host + "/echo");

  ws.onopen = (channel, userid, name) => {
    var message = {
      channel: channel,
      userId: userId,
      name: name,
      action: consts.ACTION_INIT
    };
    ws.send(JSON.stringify(message));
  };

  ws.onmessage = (e) => {
    var data = JSON.parse(e.data);
    var action = data.action;
    console.log(data);

    if (action === consts.ACTION_MESSAGE) {

      var $singleMessage = $('<div>', {
        "class": 'message'
      });

      var $userInfo = $('<span/>', {
        "class": "user",
        text: data.name
      });

      var $time = $('<span class="time">' + data.at.substr(0, 10) + '</span>)');

      var $messageText = $('<span/>', {
        "class": "message"
      });

      $messageText.html(emojione.toImage(data.message));

      $singleMessage.append($time);
      $singleMessage.append(" ");
      $singleMessage.append($userInfo);
      $singleMessage.append(": ");
      $singleMessage.append($messageText);

      $messages.append($singleMessage);
    }

    else if (action === consts.ACTION_JOINED) {
      addMessage(data.name + " joined channel", "joined");
    }

    else if (action === consts.ACTION_CONNECTED) {
      $loader.remove();
      $chat.append($messages);
      $chat.append($inputControl);

      addMessage("You joined " + channel, "joined");
    }

    $messages.scrollTop($messages[0].scrollHeight);
  };
};


export const sendData = (channel, userid, name, message) => {
  if (message === '') {
    return;
  }

  var data = {
    channel: channel,
    userId: userId,
    name: name,
    message: message,
    action: consts.ACTION_MESSAGE
  };

  var stringData = JSON.stringify(data);
  ws.send(stringData);
  console.log("Sent " + stringData);
};

export const addMessage = (text, type) => {


  $singleMessage.append($text);
  $messages.append($singleMessage);
};
