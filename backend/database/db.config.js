// read environment variables from .env file
require('dotenv').config({ path: './.env'})
const welshWordsListsUser = process.env.WELSHWORDSLISTS_USER;
const welshWordsListsPassword = process.env.WELSHWORDSLISTS_PASSWORD;
const wordNetUser = process.env.WORDNET_USER;
const wordNetPassword = process.env.WORDNET_PASSWORD;

module.exports = {
    urlWelshWords: `mongodb://${welshWordsListsUser}:${welshWordsListsPassword}@localhost:27017/welshWordsLists`,
    urlWordNet: `mongodb://${wordNetUser}:${wordNetPassword}@localhost:27017/wordNetWelsh`
  };