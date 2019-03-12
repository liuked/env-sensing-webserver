

var socket = null;
var showTimeStamp = false;
var addressBox = null;

var logBox = null;
var messageBox = null;



function getTimeStamp() {
  return new Date().getTime();
}
function addToLog(log) {
  if (showTimeStamp) {
    logBox.value += '[' + getTimeStamp() + '] ';
  }
  logBox.value += log + '\n'
  // Large enough to keep showing the latest message.
  logBox.scrollTop = 1000000;
}

function connect() {
  var url = addressBox.value;
  if ('WebSocket' in window) {
      socket = new WebSocket(url);
  } else {
    return;
  }

  socket.onopen = function () {
    var extraInfo = [];
    if (('protocol' in socket) && socket.protocol) {
      extraInfo.push('protocol = ' + socket.protocol);
    }
    if (('extensions' in socket) && socket.extensions) {
      extraInfo.push('extensions = ' + socket.extensions);
    }
    var logMessage = 'Opened';
    if (extraInfo.length > 0) {
      logMessage += ' (' + extraInfo.join(', ') + ')';
    }
    addToLog(logMessage);
  };
  socket.onmessage = function (event) {
    if (('ArrayBuffer' in window) && (event.data instanceof ArrayBuffer)) {
      addToLog('< Received an ArrayBuffer of ' + event.data.byteLength +
               ' bytes')
    } else if (('Blob' in window) && (event.data instanceof Blob)) {
      addToLog('< Received a Blob of ' + event.data.size + ' bytes')
    } else {
      addToLog('< ' + event.data);
    }
  };
  socket.onerror = function () {
    addToLog('Error');
  };
  socket.onclose = function (event) {
    var logMessage = 'Closed (';
    if ((arguments.length == 1) && ('CloseEvent' in window) &&
        (event instanceof CloseEvent)) {
      logMessage += 'wasClean = ' + event.wasClean;
      // code and reason are present only for
      // draft-ietf-hybi-thewebsocketprotocol-06 and later
      if ('code' in event) {
        logMessage += ', code = ' + event.code;
      }
      if ('reason' in event) {
        logMessage += ', reason = ' + event.reason;
      }
    } else {
      logMessage += 'CloseEvent is not available';
    }
    addToLog(logMessage + ')');
  };
  
  addToLog('Connect ' + url);

}



function init() {
  var scheme = window.location.protocol == 'https:' ? 'wss://' : 'ws://';
  var defaultAddress = scheme + window.location.host + '/sensors/pms';

  addressBox = document.getElementById('address');
  logBox = document.getElementById('log');
  messageBox = document.getElementById('message');
  codeBox = document.getElementById('code');
  reasonBox = document.getElementById('reason');

  addressBox.value = defaultAddress;



  if (!('WebSocket' in window)) {
    addToLog('WebSocket is not available');
  }
}



function closeSocket() {
  if (!socket) {
    addToLog('Not connected');
    return;
  }
  if (codeBox.value || reasonBox.value) {
    socket.close(codeBox.value, reasonBox.value);
  } else {
    socket.close();
  }
}

function printState() {
  if (!socket) {
    addToLog('Not connected');
    return;
  }
  addToLog(
      'url = ' + socket.url +
      ', readyState = ' + socket.readyState +
      ', bufferedAmount = ' + socket.bufferedAmount);
}





