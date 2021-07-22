const express = require('express');
const router = express.Router();
const { executeHandler } = require("../../utils/httpHandler");
//const { getDb } = require("../../database/dbinit");
const { addIssue, getMyIssues, updateIssue, isAuthor, getIssue, filterAssigned, filterStatus } = require("../../database/reporter.db");

router.post("/addIssue", executeHandler(async (req) => {
  const result = await addIssue(req.username, req.body);
  return result.acknowledged;
})
);

router.get("/Issues", executeHandler(async (req) => {
  return await getMyIssues(req.user.username);
})
);
router.put("/Issue/:id", executeHandler(async (req) => {
  const id = req.params.id;
  if (isAuthor(id, req.user.username) === true) {
    const issue = {};
    for (let prop in req.body)
      if (req.body[prop]) issue[prop] = req.body[prop];
    if (await updateIssue(id, issue)) {
      return "It was successfully updated";
    }
  }
  else {
    return "Only the author can update a Issue";
  }
})
);
router.get("Issue/Assigned/:username", executeHandler(async (req) => {
  const username = req.params.username;
  return await filterAssigned(username, req.user.username);
})
);
router.get("Issue/Status/:status", executeHandler(async (req) => {
  const status = req.params.status;
  return await filterStatus(req.user.username, status);
})
);

router.get("/Issue/:id", executeHandler(async (req) => {
  const id = req.params.id;
  console.log(req.user);
  return await getIssue(id, req.user.username);
})
);

router.get("/testR", (req, res) => {
  res.send(req.user);
});

module.exports = router;