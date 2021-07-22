const { getDb } = require("./dbinit.js");
const mongo = require("mongodb");

/**
 * 
 * @param {String} username 
 * @returns the Mongo Object of all Issues assigned to this User
 */
async function getAssignedIssues(username) {
  return await getDb()
    .collection("Issue")
    .find({ assignedUser: username })
    .toArray();
}

// async function addComment(data){

// }

/**
 * 
 * @param {Object ID } idIssue 
 * @returns 
 */
async function solveIssue(idIssue, status) {
  status = "S";
  return await updateStatus(idIssue, status);
}

/**
 * 
 * @param {Object ID} idIssue 
 * @param {String} username 
 * @returns true or false 
 */
async function isAssignedIssue(idIssue, username) {
  const issue = await getDb()
    .collection("Issue")
    .find({ _id: new mongo.ObjectId(idIssue) })
    .toArray();
  if (issue.assignedUser === username) {
    return true;
  }
  return false;
}
/**
 * 
 * @param {*} id 
 * @param {*} status 
 * @returns 
 */
async function updateStatus(id, status) {
  return await getDb()
    .collection("Issue")
    .updateOne({ _id: new mongo.ObjectId(id) }, { $set: { status } });
}

async function filterAuthor(author, assignedUser) {
  return await getDb().collection("Issue").find({ author, assignedUser }).toArray();
}
async function filterStatus(assignedUser, status) {
  return await getDb().collection("Issue").find({ assignedUser, status }).toArray();
}

module.exports = {
  getAssignedIssues,
  solveIssue,
  isAssignedIssue,
  updateStatus,
  filterAuthor,
  filterStatus
};
