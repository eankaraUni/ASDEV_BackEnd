var express = require('express');
var router = express.Router();
const {executeHandler}  = require("../../utils/httpHandler");

router.get("/addIssue",  executeHandler(async (req) => {
    return req.username;
  })
  );
// const author = req.user;
module.exports = {
    reporterC : router
};