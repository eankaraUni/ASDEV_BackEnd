var express = require('express');
var router = express.Router();
const {executeHandler} = require("../../utils/httpHandler");
// const {executeHandler}  = require("../../utils/httpHandler");
const {getUserFromToken} = require("../../database/token.js");
const {getUsers, getIssuesAdmin} = require("../../database/admin.db");
const {IssueStatus} = require("../../models/statusRoles.module");
const {getDb} = require ("../../database/dbinit");

router.get("/testA", (req, res) => {
    // res.send("ok");
    // return ("fewew");
    res.send(req.params);
  });
  router.get(
    "/getUsers/",
    executeHandler(async (req) => {
      const loggedInUser = await getUserFromToken(req.headers);
      if (loggedInUser.role === "A") {
        return await getUser();
      } else {
        const err = new Error("This information is only for the admin");
        err.statusCode = 400;
        throw err;
      }
    })
  );
  router.get("/issues", executeHandler(async (req) => {
    try {
      const loggedInUser = await getUserFromToken(req.headers);
  
      // const filter = {};
      // if (user.role === Roles.operator) {
      //   filter.assignedUser = user.username;
      // }
      // if (user.role === Roles.reporter) {
      //   filter.author = user.username;
      // }
      // const result = await getDb().collection("Issue").find(filter).toArray();
      //res.send();
      return await getIssueAdmin;
    } catch (err) {}
  }));

  router.post("/assignIssue/:id", async (req, res) => {
    try {
      //solve the Issue
      const id = req.params.id;
      const assignedUser = req.body.assignedUser;
      const loggedInUser = await getUserFromToken(req.headers);
      if (loggedInUser.role === "A") {
        const result = await getDb()
          .collection("Issue")
          .updateOne(
            { _id: new mongo.ObjectId(id) },
            { $set: { assignedUser, status: IssueStatus.inProgress } }
          );
        //issue._id = result.upsertedId;
        res.send({ id, assignedUser });
      } else {
        res.send("Only Admin can assign Issue-Tickets");
      }
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
        //issue._id = result.upsertedId;
        res.send({ username, firstname });
      } else {
        res.send("Only Admin can assign Issue-Tickets");
      }
    } catch (err) {
      res.send("Issue Updating failed");
    }
  });

  module.exports = router;