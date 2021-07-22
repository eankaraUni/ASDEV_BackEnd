var express = require('express');
var router = express.Router();
//const { executeHandler } = require("../../utils/httpHandler");
const { isAssignedIssue, getAssignedIssues, filterAuthor, filterStatus, solveIssue } = require("../../database/operator.db");
const { getUserFromToken } = require("../../database/token.js");
//const { getDb } = require("../../database/dbinit");
const {IssueStatus} = require("../../models/statusRoles.module");

router.get("/testO", (req, res) => {
  res.send(req.user);
});

router.get("/Issues", async (req, res) => {
  try {
    const loggedInUser = await getUserFromToken(req.headers);
    return await getAssignedIssues(loggedInUser.username);
  } catch (err) {
    res.send("Failed to get the data");
  }
});

//router.post comments section

router.get("/issues/Status/:status", async (req, res) => {
  try {
    const loggedInUser = await getUserFromToken(req.headers);
    const status = req.params.status;
    const result = await filterStatus(loggedInUser.username, status);
    res.send(result);
    //res.send();
  } catch (err) { }
});
router.get("issues/Author/:author", async (req, res) => {
  try {
    const loggedInUser = await getUserFromToken(req.headers);
    const author = req.params.author;
    const result = await filterAuthor(author, loggedInUser.username);
    res.send(result);

  } catch (err) { }
});
router.post("/api/updateStatus/:id", async (req, res) => {
  try {
    //solve the Issue
    const id = req.params.id;
    const status = IssueStatus.solved;
    const loggedInUser = await getUserFromToken(req.headers);
    if (await isAssignedIssue(id, loggedInUser.username) === true) {
      const result = await solveIssue(id, status);
      res.send(result);
    } else {
      res.send("Only the assigned User can resolve the Issue");
    }
  } catch (err) {
    res.send("Issue Status Updating failed");
  }
});

module.exports = router;