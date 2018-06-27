## 7. Set up a signaling service to exchange messages

## What you'll learn

In this step, you'll find out how to:

- Use `npm` to install project dependencies as specified in **package.json**
- Run a Node.js server and use node-static to serve static files.
- Set up a messaging service on Node.js using Socket.IO.
- Use that to create 'rooms' and exchange messages.

A complete version of this step is in the **step-04** folder.

## Concepts

In order to set up and maintain a WebRTC call, WebRTC clients (peers) need to exchange metadata:

- Candidate (network) information.
- **Offer** and **answer** messages providing information about media, such as resolution and codecs.

In other words, an exchange of metadata is required before peer-to-peer streaming of audio, video, or data can take place. This process is called **signaling**.

In the previous steps, the sender and receiver RTCPeerConnection objects are on the same page, so 'signaling' is simply a matter of passing metadata between objects.

In a real world application, the sender and receiver RTCPeerConnections run in web pages on different devices, and you need a way for them to communicate metadata.

For this, you use a **signaling server**: a server that can pass messages between WebRTC clients (peers). The actual messages are plain text: stringified JavaScript objects.

## Prerequisite: Install Node.js

In order to run the next steps of this codelab (folders **step-04** to **step-06**) you will need to run a server on localhost using Node.js.

You can download and install Node.js from [this link](https://nodejs.org/en/download/) or via your preferred [package manager](https://nodejs.org/en/download/package-manager/).

Once installed, you will be able to import the dependencies required for the next steps (running `npm install`), as well as running a small localhost server to execute the codelab (running `node index.js`). These commands will be indicated later, when they are required.

## About the app

WebRTC uses a client-side JavaScript API, but for real-world usage also requires a signaling (messaging) server, as well as STUN and TURN servers. You can find out more [here](https://www.html5rocks.com/en/tutorials/webrtc/infrastructure/).

In this step you'll build a simple Node.js signaling server, using the Socket.IO Node.js module and JavaScript library for messaging. Experience with Node.js and Socket.IO will be useful, but not crucial; the messaging components are very simple.

**Choosing the right signaling server**

This codelab uses [Socket.IO](http://socket.io/) for a signaling server.

The design of Socket.IO makes it straightforward to build a service to exchange messages, and Socket.IO is suited to learning about WebRTC signaling because of its built-in concept of 'rooms'.

**However, for a production service, there are better alternatives. **See [How to Select a Signaling Protocol for Your Next WebRTC Project](https://bloggeek.me/siganling-protocol-webrtc/).

In this example, the server (the Node.js application) is implemented in **index.js**, and the client that runs on it (the web app) is implemented in **index.html**.

The Node.js application in this step has two tasks.

First, it acts as a message relay:

```
socket.on('message', function (message) {
  log('Got message: ', message);
  socket.broadcast.emit('message', message);
});
```

Second, it manages WebRTC video chat 'rooms':

```
if (numClients === 0) {
  socket.join(room);
  socket.emit('created', room, socket.id);
} else if (numClients === 1) {
  socket.join(room);
  socket.emit('joined', room, socket.id);
  io.sockets.in(room).emit('ready');
} else { // max two clients
  socket.emit('full', room);
}
```

Our simple WebRTC application will permit a maximum of two peers to share a room.

## HTML & JavaScript

Update **index.html** so it looks like this:

```
<!DOCTYPE html>
<html>

<head>

  <title>Realtime communication with WebRTC</title>

  <link rel="stylesheet" href="css/main.css" />

</head>

<body>

  <h1>Realtime communication with WebRTC</h1>

  <script src="/socket.io/socket.io.js"></script>
  <script src="js/main.js"></script>
  
</body>

</html>

```

You won't see anything on the page in this step: all logging is done to the browser console. (To view the console in Chrome, press Ctrl-Shift-J, or Command-Option-J if you're on a Mac.)

Replace **js/main.js** with the following:

```
'use strict';

var isInitiator;

window.room = prompt("Enter room name:");

var socket = io.connect();

if (room !== "") {
  console.log('Message from client: Asking to join room ' + room);
  socket.emit('create or join', room);
}

socket.on('created', function(room, clientId) {
  isInitiator = true;
});

socket.on('full', function(room) {
  console.log('Message from client: Room ' + room + ' is full :^(');
});

socket.on('ipaddr', function(ipaddr) {
  console.log('Message from client: Server IP address is ' + ipaddr);
});

socket.on('joined', function(room, clientId) {
  isInitiator = false;
});

socket.on('log', function(array) {
  console.log.apply(console, array);
});
```

## Set up Socket.IO to run on Node.js

In the HTML file, you may have seen that you are using a Socket.IO file:

```
<script src="/socket.io/socket.io.js"></script>
```

At the top level of your **work** directory create a file named **package.json** with the following contents:

```
{
  "name": "webrtc-codelab",
  "version": "0.0.1",
  "description": "WebRTC codelab",
  "dependencies": {
    "node-static": "^0.7.10",
    "socket.io": "^1.2.0"
  }
}
```

This is an app manifest that tells Node Package Manager (`npm`) what project dependencies to install.

To install dependencies (such as `/socket.io/socket.io.js`), run the following from the command line terminal, in your **work** directory:

```
npm install
```

You should see an installation log that ends something like this:

![img](https://codelabs.developers.google.com/codelabs/webrtc-web/img/eba5a6336d420b40.png)

As you can see, `npm` has installed the dependencies defined in **package.json**.

Create a new file **index.js** at the top level of your **work** directory (not in the **js** directory) and add the following code:

```
'use strict';

var os = require('os');
var nodeStatic = require('node-static');
var http = require('http');
var socketIO = require('socket.io');

var fileServer = new(nodeStatic.Server)();
var app = http.createServer(function(req, res) {
  fileServer.serve(req, res);
}).listen(8080);

var io = socketIO.listen(app);
io.sockets.on('connection', function(socket) {

  // convenience function to log server messages on the client
  function log() {
    var array = ['Message from server:'];
    array.push.apply(array, arguments);
    socket.emit('log', array);
  }

  socket.on('message', function(message) {
    log('Client said: ', message);
    // for a real app, would be room-only (not broadcast)
    socket.broadcast.emit('message', message);
  });

  socket.on('create or join', function(room) {
    log('Received request to create or join room ' + room);

    var clientsInRoom = io.sockets.adapter.rooms[room];
    var numClients = clientsInRoom ? Object.keys(clientsInRoom.sockets).length : 0;

    log('Room ' + room + ' now has ' + numClients + ' client(s)');

    if (numClients === 0) {
      socket.join(room);
      log('Client ID ' + socket.id + ' created room ' + room);
      socket.emit('created', room, socket.id);

    } else if (numClients === 1) {
      log('Client ID ' + socket.id + ' joined room ' + room);
      io.sockets.in(room).emit('join', room);
      socket.join(room);
      socket.emit('joined', room, socket.id);
      io.sockets.in(room).emit('ready');
    } else { // max two clients
      socket.emit('full', room);
    }
  });

  socket.on('ipaddr', function() {
    var ifaces = os.networkInterfaces();
    for (var dev in ifaces) {
      ifaces[dev].forEach(function(details) {
        if (details.family === 'IPv4' && details.address !== '127.0.0.1') {
          socket.emit('ipaddr', details.address);
        }
      });
    }
  });

});
```

From the command line terminal, run the following command in the **work** directory:

```
node index.js
```

From your browser, open **localhost:8080**.

Each time you open this URL, you will be prompted to enter a room name. To join the same room, choose the same room name each time, such as 'foo'.

Open a new tab page, and open **localhost:8080** again. Choose the same room name.

Open **localhost:8080** in a third tab or window. Choose the same room name again.

Check the console in each of the tabs: you should see the logging from the JavaScript above.

## Bonus points

1. What alternative messaging mechanisms might be possible? What problems might you encounter using 'pure' WebSocket?
2. What issues might be involved with scaling this application? Can you develop a method for testing thousands or millions of simultaneous room requests?
3. This app uses a JavaScript prompt to get a room name. Work out a way to get the room name from the URL. For example *localhost:8080/foo* would give the room name `foo`.

## What you learned

In this step, you learned how to:

- Use npm to install project dependencies as specified in package.json
- Run a Node.js server to server static files.
- Set up a messaging service on Node.js using socket.io.
- Use that to create 'rooms' and exchange messages.

A complete version of this step is in the **step-04** folder.

## Find out more

- [Socket.io chat-example repo](https://github.com/rauchg/chat-example)
- [WebRTC in the real world: STUN, TURN and signaling](http://www.html5rocks.com/en/tutorials/webrtc/infrastructure/)
- [The term 'signaling' in WebRTC](https://www.webrtc-experiment.com/docs/WebRTC-Signaling-Concepts.html)

## Next up

Find out how to use signaling to enable two users to make a peer connection.

