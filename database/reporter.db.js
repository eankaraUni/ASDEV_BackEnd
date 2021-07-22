const { getDb } = require("./dbinit.js");
const { buildIssue, IssueStatus } = require("../models/statusRoles.module");
const mongo = require("mongodb");

async function getMyIssues(username) {
  return await getDb().collection("Issue").find({ author: username }).toArray();
}

async function addIssue(username, data) {
  const { description, streetAddress, city, country } = data;
  const issue = buildIssue({
    status: IssueStatus.open,
    streetAddress,
    description,
    city,
    country,
    raportedDate: new Date(),
    author: username,
    assignedUsser: ""
  });
  return await getDb().collection("Issue").insertOne(issue);
}

async function updateIssue(idIssue, data) {
  await getDb()
    .collection("Issue")
    .updateOne({ _id: new mongo.ObjectId(idIssue) }, { $set: data });
}

async function deleteIssue(idIssue) {
  await getDb().collection("Issue").deleteOne({ _id: idIssue });
}

async function isAuthor(idIssue, username) {
  const issue = await getDb()
    .collection("Issue")
    .findOne({ _id: new mongo.ObjectId(idIssue) });
  console.log(issue);
  if (issue.author === username) {
    return true;
  }
  return false;
}
async function getIssue(idIssue, username) {
  if ((isAuthor(idIssue, username)) === true) {
    return await getDb()
      .collection("Issue")
      .findOne({ _id: new mongo.ObjectId(idIssue) });
  }
  else {
    return "Only the Author can have access to the his Issues";
  }
}
async function filterAssigned(assignedUser, author) {
  return await getDb()
    .collection("Issue")
    .find({ assignedUser, author }).toArray();
}
async function filterStatus(author, status) {
  return await getDb()
    .collection("Issue")
    .find({ author, status }).toArray();

}
module.exports = { addIssue, updateIssue, getMyIssues, deleteIssue, isAuthor, getIssue, filterAssigned, filterStatus };
