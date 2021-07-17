const { getDB } = require("./dbinit.js");
const mongo = require("mongodb");

async function getAssignedIssues(username) {
  return await getDb()
    .collection("Issue")
    .find({ assignedUser: username })
    .toArray();
}

// async function addComment(data){

// }
async function solveIssue(idIssue) {
  return await getDb()
    .collection("Issue")
    .updateOne({ _id: new mongo.ObjectId(idIssue) }, { $set: { status } });
}

async function isAssignedIssue(idIssue, username) {
  const issue = await getDb()
    .collection("Issue")
    .find({ _id: new mongo.ObjectId(idIssue), assignedUser: username })
    .toArray();
  if (!issue) {
    return false;
  }
  return true;
}

module.exports = {
  getAssignedIssues,
  solveIssue,
  isAssignedIssue,
};
