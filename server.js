"use strict";

const express = require("express");
const got = require("got");
const { Server } = require("ws");
const { parseTweet } = require("./lib/parse-tweet");

const PORT = process.env.PORT || 3000;
const INDEX = "/index.html";

if (!process.env.TWITTER_BEARER_TOKEN) {
  console.error(
    "This app requires TWITTER_BEARER_TOKEN in process.env. Please set TWITTER_BEARER_TOKEN."
  );
  process.exit(1);
}

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const wss = new Server({ server });

const streamURL = new URL(
  "https://api.twitter.com/2/tweets/search/stream?tweet.fields=author_id,created_at&expansions=author_id&user.fields=name"
);

wss.on("connection", function connection(ws) {
  ws.on("message", async function incoming(message) {
    console.log("received: %s", message);

    // 接続維持用のメッセージの場合はここで終了
    if (message === "KEEPALIVE") {
      return;
    }

    const messageString = message.toString();
    // messageの冒頭が "FETCH_TWEET"の場合は過去ツイートを取得する
    if (messageString.match(/^FETCH_TWEET:/)) {
      const query = messageString.split(":")[1];

      const url = `https://api.twitter.com/2/tweets/search/recent?query=${encodeURIComponent(
        query
      )}&tweet.fields=author_id,created_at&expansions=author_id&user.fields=name`;
      const res = await got
        .get(url, {
          headers: {
            Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
          },
        })
        .json();
      res.data.forEach((datum) => {
        const tweetMessage = parseTweet(datum, res.includes.users);
        wss.clients.forEach((client) => {
          client.send(tweetMessage);
        });
      });
    }
    wss.clients.forEach((client) => {
      client.send(message);
    });
  });

  ws.on("close", function () {
    console.log("close");
  });
});

try {
  const stream = got.stream(streamURL, {
    headers: {
      Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
    },
  });

  stream
    .on("data", (data) => {
      try {
        const json = JSON.parse(data);
        if (json.connection_issue) {
          json.error(json);
          // reconnect(stream, socket, token);
        } else {
          if (json.data) {
            // console.log(json.data)
            const message = parseTweet(json.data, json.includes.users);
            console.log(`send message: ${message}`);

            wss.clients.forEach((client) => {
              client.send(message);
            });
          } else {
            console.error(json);
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
      console.error(error);
      // reconnect(stream, socket, token);
    });
} catch (e) {
  console.error(e);
}
