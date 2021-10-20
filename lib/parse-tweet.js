function parseTweet(tweetData, users) {
  console.log(users)
  const user = users.find((user) => user.id == tweetData.author_id);
  const message = `${tweetData.text},${user.username},${tweetData.created_at}`;
  return message;
}
module.exports = {
  parseTweet,
};
