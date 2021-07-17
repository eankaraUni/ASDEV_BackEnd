var express = require("express");
var router = express.Router();
const { getUsername, isPwdMatch } = require("../database/auth.db");
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

router.get("/test", (req, res) => {
  res.send("ok");
});

module.exports = {
  auth: router,
};
