var express = require("express");
var router = express.Router();

const { getUsername, isPwdMatch, signup } = require("../database/auth.db");
const { createToken } = require("../database/token.js");
const { executeHandler } = require("../utils/httpHandler");

router.post(
  "/users/login",
  executeHandler(async (req) => {
    const { username, password } = req.body;

    const user = await getUsername(username);
    if (!user) {
      return res.status(401).send("Authentication failed");
    }
    const isMatch = await isPwdMatch(password, user);
    if (!isMatch) {
      return res.status(401).send("Authentication failed");
    }
    const token = await createToken(user);
    return {
      user: { username: user.username },
      token,
    };
  })
);

router.post(
  "/users/signup",
  executeHandler(async (req) => {
    const result = await signup(req.body);
    return(result.acknowledged);
  })
);

router.get("/test", (req, res) => {
  res.send("ok");
});

module.exports = router;
