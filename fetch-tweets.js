const got = require("got");
const {parseTweet} = require("./lib/parse-tweet")

async function fetch(query) {
  const url = `https://api.twitter.com/2/tweets/search/recent?query=${encodeURIComponent(
    query
  )}&tweet.fields=author_id,created_at&expansions=author_id&user.fields=name`;
  const res = await got.get(url, {
    headers: {
      Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
    },
  }).json();
  return res;
}

fetch("#ttrealtime").then((result) => {
  result.data.forEach((datum) => {
    console.log(parseTweet(datum, result.includes.users))
  })
});
