const { getDb } = require("./dbinit.js");
const bcrypt = require("bcryptjs");

async function getUsername(username) {
  return await getDb().collection("User").findOne({ username });
}

async function isPwdMatch(password, user) {
  return await bcrypt.compare(password, user.password);
}

module.exports = {
  getUsername,
  isPwdMatch,
};
