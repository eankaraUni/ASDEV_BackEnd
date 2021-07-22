var express = require('express');
var router = express.Router();
const { executeHandler } = require("../../utils/httpHandler");
// const {executeHandler}  = require("../../utils/httpHandler");
const { getUserFromToken } = require("../../database/token.js");
const { getUsers, getIssuesAdmin, assignIssue } = require("../../database/admin.db");
const { IssueStatus } = require("../../models/statusRoles.module");
const { getDb } = require("../../database/dbinit");

router.get("/testA", (req, res) => {
  res.send(req.user);
});

router.get(
  "/Users",
  executeHandler(async (req) => {
    // const loggedInUser = await getUserFromToken(req.headers);
    return await getUsers();
  }
  )
);
router.get("/Issues", executeHandler(async (req) => {
  try {
    //const loggedInUser = await getUserFromToken(req.headers);
    return await getIssuesAdmin();
  } catch (err) { }
}));

router.post("/assignIssue/:id", async (req, res) => {
  try {
    //solve the Issue
    const id = req.params.id;
    const assignedUser = req.body.assignedUser;
    // const loggedInUser = await getUserFromToken(req.headers);
    const result = await assignIssue(id, assignedUser);
    //issue._id = result.upsertedId;
    res.send(result);

  } catch (err) {
    res.send("Issue Updating failed");
  }
});
router.post("/updateUser/:username", async (req, res) => {
  try {
    //solve the Issue
    const username = req.params.username;
    const firstname = req.body.firstname;
    const loggedInUser = await getUserFromToken(req.headers);
    if (loggedInUser.role === "A") {
      const result = await getDb()
        .collection("User")
        .updateOne({ username: username }, { $set: { firstname } });
      res.send({ username, firstname });
    } else {
      res.send("Only Admin can assign Issue-Tickets");
    }
  } catch (err) {
    res.send("Issue Updating failed");
  }
});

module.exports = router;