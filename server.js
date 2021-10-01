'use strict';

const express = require('express');
const got = require('got');
const { Server } = require('ws');

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

if (!process.env.TWITTER_BEARER_TOKEN) {
  console.error('This app requires TWITTER_BEARER_TOKEN in process.env. Please set TWITTER_BEARER_TOKEN.')
  process.exit(1)
}

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const wss = new Server({ server });

const streamURL = new URL(
  "https://api.twitter.com/2/tweets/search/stream?tweet.fields=author_id,created_at&expansions=author_id&user.fields=name"
);

wss.on('connection', function connection(ws) {
  console.log('connection');
  ws.on('message', function incoming(message) {
      console.log('received: %s', message);

      // 接続維持用のメッセージの場合はここで終了
      if (message === 'KEEPALIVE') {
          return
      }
      wss.clients.forEach((client) => {
          client.send(message);
      });
  });

  ws.on('close', function() {
      console.log('close');
  });
});



try {
  const stream = got.stream(streamURL, {
    headers: {
      "Authorization": `Bearer ${process.env.TWITTER_BEARER_TOKEN}`
    }
  })

  stream
    .on("data", (data) => {
      try {
        const json = JSON.parse(data);
        if (json.connection_issue) {
          json.error(json)
          // reconnect(stream, socket, token);
        } else {
          if (json.data) {
            // console.log(json.data)
            const username = json.includes.users[0].username
            const message = `${json.data.text},${username},${json.data.created_at}`
            console.log(`send message: ${message}`)

            wss.clients.forEach((client) => {
              client.send(message);
          });
          } else {
            console.error(json)
            // socket.emit("authError", json);
          }
        }
      } catch (e) {
        // socket.emit("heartbeat");
      }
    })
    .on("error", (error) => {
      // Connection timed out
      // socket.emit("error", errorMessage);
      console.error(error)
      // reconnect(stream, socket, token);
    });
} catch (e) {
  console.error(e)
}

