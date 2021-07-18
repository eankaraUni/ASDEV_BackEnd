var express = require('express');
var router = express.Router();
const {executeHandler}  = require("../../utils/httpHandler");
const {isAssignedIssue} = require("../../database/operator.db");
const {getUserFromToken} = require("../../database/token.js");
const {getDb} = require ("../../database/dbinit");

router.get("/testO", (req, res) => {
    res.send("ok");
  });

router.get("/issues", async (req, res) => {
  try {
    const loggedInUser = await getUserFromToken(req.headers);

    const filter = {};
    if (user.role === Roles.operator) {
      filter.assignedUser = user.username;
    }
    // if (user.role === Roles.reporter) {
    //   filter.author = user.username;
    // }
    const result = await getDb().collection("Issue").find(filter).toArray();
    res.send(result);
    //res.send();
  } catch (err) {}
});

router.get("/issues/Status/:status", async (req, res) => {
  try {
    const loggedInUser = await getUserFromToken(req.headers);
    const status = req.params.status;
    const filter = { status: status, assignedUser };
    if (loggedInUser.role === Roles.operator) {
      filter.assignedUser = user.username;
    }
    const result = await getDb().collection("Issue").find(filter).toArray();
    res.send(result);
    //res.send();
  } catch (err) {}
});
router.get("issues/Author/:author", async (req, res) => {
  try {
    const loggedInUser = await getUserFromToken(req.headers);    const author = req.params.author;
    const filter = { author: author , assignedUser};
    if (user.role === Roles.operator) {
      filter.assignedUser = user.username;
      const result = await getDb().collection("Issue").find(filter).toArray();
    }
    else{
        result = "Only operators and admin can filter by author"
    }
    res.send(result);
    //res.send();
  } catch (err) {}
});
router.put("/api/updateStatus/:id", async (req, res) => {
  try {
    //solve the Issue
    const id = req.params.id;
    const status = req.body.status;
    const loggedInUser = await getUserFromToken(req.headers);    const author = req.params.author;
    
    // const AssignedData = await getDb()
    //   .collection("Issue")
    //   .findOne({ assignedUser: loggedInUser.username });
    if (await isAssignedIssue(id,loggedInUser.username)) {
      const result = await getDb()
        .collection("Issue")
        .updateOne({ _id: new mongo.ObjectId(id) }, { $set: { status } });
      //issue._id = result.upsertedId;
      res.send({ id, loggedInUser });
    } else {
      res.send("Only the assigned User can resolve the Issue");
    }
  } catch (err) {
    res.send("Issue Updating failed");
  }
});
  
module.exports = router;