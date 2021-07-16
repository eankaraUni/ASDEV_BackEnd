const { getDB } = require("./dbinit.js");
const buildIssue = require("../models/statusRoles.module");
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
  });
  return await getDb().collection("Issue").insertOne({ issue });
}

async function updateIssue(idIssue, data) {
  await getDb()
    .collection("Issue")
    .updateOne({ _id: new mongo.ObjectId(id) }, { $set: data });
}

async function deleteIssue(idIssue) {
  await getDb().collection("Issue").deleteOne({ _id: idIssue });
}

async function isAuthor(idIssue, username) {
  const issue = await getDb()
    .collection("Issue")
    .find({ _id: new mongo.ObjectId(idIssue), author: username })
    .toArray();
  if (!issue) {
    return false;
  }
  return true;
}

module.exports = { addIssue, updateIssue, getMyIssues, deleteIssue, isAuthor };
