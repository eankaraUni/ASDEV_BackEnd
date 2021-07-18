const { getDb } = require("./dbinit.js");
const bcrypt = require("bcryptjs");

async function getUsername(username) {
  return await getDb().collection("User").findOne({ username });
}

async function isPwdMatch(password, user) {
  return await bcrypt.compare(password, user.password);
}
async function signup(data) {
  return getDb()
    .collection("User")
    .insertOne({
      username: data.username,
      password: bcrypt.hashSync(data.password),
      role: data.role,
    });
}

module.exports = {
  getUsername,
  isPwdMatch,
  signup
};
