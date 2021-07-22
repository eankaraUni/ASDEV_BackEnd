var express = require('express');
var router = express.Router();
const { executeHandler } = require("../../utils/httpHandler");
const { isAssignedIssue, getAssignedIssues, filterAuthor, filterStatus, solveIssue } = require("../../database/operator.db");
const { getUserFromToken } = require("../../database/token.js");
//const { getDb } = require("../../database/dbinit");
const {IssueStatus} = require("../../models/statusRoles.module");

router.get("/testO", (req, res) => {
  res.send(req.user);
});

router.get("/Issues", executeHandler(async (req) => {
    //const loggedInUser = await getUserFromToken(req.headers);
    return await getAssignedIssues(req.user.username);
}));

//router.post comments section

router.get("/issues/Status/:status", executeHandler(async (req) => {
    const status = req.params.status;
    const result = await filterStatus(req.user.username, status);
    res.send(result);
    //res.send();

}));
router.get("issues/Author/:author", executeHandler(async (req) => {

    const author = req.params.author;
    const result = await filterAuthor(author, req.user.username);
    res.send(result);

}));
router.post("/updateStatus/:id", executeHandler(async (req) => {
    //solve the Issue
    const id = req.params.id;
    const status = IssueStatus.solved;
    //if (await isAssignedIssue(id, req.user.username) === true) {
      return await solveIssue(id, status);
    // } else {
    //   return ("Only the assigned User can resolve the Issue");
    // }
}));

module.exports = router;