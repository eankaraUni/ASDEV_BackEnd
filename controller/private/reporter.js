var express = require('express');
var router = express.Router();
const {executeHandler}  = require("../../utils/httpHandler");
const {getDb} = require ("../../database/dbinit");

router.get("/addIssue",  executeHandler(async (req) => {
    return req.username;
  })
  );
  router.get("/testR", (req, res) => {
    res.send("ok");
  });
// const author = req.user;

module.exports = router;