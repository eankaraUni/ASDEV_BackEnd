var express = require("express");
var router = express.Router();
const { getUsernameFromToken } = require("../database/token.js");
const router_r = require("./private/reporter.js");
const router_o = require("./private/operator.js");
const router_a = require("./private/admin.js");

router.use(async (req, res, ifNext) => {
  const authorization = req.headers.authorization;
  const user = await getUsernameFromToken(authorization);
  req.user = user.username;
  req.role = user.role;
  return ifNext(undefined, req);
});
function isReporter(req, res, next) {
  if (req.role === "R") {
    ifNext();
  }
  return res.json({
    message: "You don't have permission",
  });
}
function isOperator(req, res, next) {
  if (req.role === "O") {
    ifNext();
  }

  return res.json({
    message: "You don't have permission",
  });
}
function isAdmin(req, res, next) {
  if (req.role === "A") {
    ifNext();
  }

  return res.json({
    message: "You don't have permission",
  });
}

router.use("/reporter", isReporter, router_r.reporterC);
router.use("/operator", isOperator, router_o.operatorC);
router.use("admin", isAdmin, router_a.adminC);
module.exports = {
  private: router,
};
