const { getDb } = require("./dbinit.js");
const { v4 } = require("uuid");

/**
 *
 * @param {String} username
 * @param {String: from const Roles} role
 * @returns the inserted Object in Token Collection
 */
async function createToken(user) {
  const token = v4();
  await getDb().collection("Token").insertOne({
    userId: user._id,
    token,
    created: new Date(),
  });
  return token;
}

/**
 *
 * @param {String} token usersInput
 * @param {String} authorization from Headers Request
 * @returns the Object of the user using this token
 */
async function getUserFromToken(authorization) {
  if (!authorization) {
    const error = new Error("Unath");
    error.statusCode = 401;
    throw error;
  }
  console.log(authorization);
  const authToken = authorization.split(" ")[1];
  console.log(authToken);
  const token = await getToken(authToken);
  console.log(token);
  if (!token) {
    const error = new Error("Wrong Token");
    error.statusCode = 401;
    throw error;
  }
  //TODO fix magi numbers
  if (Date.now() - token.created.getTime() > 1000 * 30 * 60) {
    const error = new Error("Token expired");
    error.statusCode = 401;
    throw error;
  } 
  return getUser(token.userId);
  
}
/**
 *
 * @param {String} authToken Users randomly generated Token
 * @returns the founded Data from Token Collection filtering by token
 */
function getToken(authToken) {
  console.log(getDb());
  return getDb().collection("Token").findOne({ token: authToken });
}
/**
 *
 * @param {ObjectId} userId
 * @returns the founded Data from User Collection filtering by userID
 */
async function getUser(userId) {
  return await getDb().collection("User").findOne({ _id: userId });
}

module.exports = { createToken, getUserFromToken };
