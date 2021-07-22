const { getDb } = require("./dbinit.js");
const bcrypt = require("bcryptjs");

/**
 * 
 * @param {String} username 
 * @returns the MongoDB Object of the User with this Username
 */
async function getUsername(username) {
  return await getDb().collection("User").findOne({ username });
}

/**
 * 
 * @param {String} password inputed Password
 * @param {Object} user MongoDB Object of User
 * @returns true or false if the hashing of the inputted User is the same or not
 */
async function isPwdMatch(password, user) {
  return await bcrypt.compare(password, user.password);
}
/**
 * 
 * @param {JSON} data from req.body
 * @returns acknoledged true and the inserted ID if the Insertion worked
 */
async function signup(data) {
  return getDb()
    .collection("User")
    .insertOne({
      firstname: data.firstname,
      lastname: data.lastname,
      username: data.username,
      password: bcrypt.hashSync(data.password),
      email: data.email,
      role: data.role,
    });
}

module.exports = {
  getUsername,
  isPwdMatch,
  signup
};
