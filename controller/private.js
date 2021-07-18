var express = require("express");
var router = express.Router();
const { getUserFromToken } = require("../database/token.js");
const { executeHandler } = require("../utils/httpHandler");

const router_r = require("./private/reporter.js");
const router_o = require("./private/operator.js");
const router_a = require("./private/admin.js");
const { Roles } = require("../models/statusRoles.module.js");



router.use(executeHandler(async (req) => {
  console.log(req.headers.authorization);
  const authorization = req.headers.authorization;
  const user = await getUserFromToken(authorization);
  console.log(user);
  // req.body.user = "user.username";
  // req.body.role = "user.role";
  req.body.user = user.username;
  req.body.role = user.role;
  next();
  // return next(undefined, req);
}));
// function isReporter(req, res, next) {
//   if (req.role === "R") {
//     next();
//   }
//   return res.json({
//     message: "You don't have permission",
//   });
// }
// function isOperator(req, res, next) {
//   if (req.role === "O") {
//     next();
//   }

//   return res.json({
//     message: "You don't have permission",
//   });
// }
// function isAdmin(req, res, next) {
//   if (req.role === "A") {
//     next();
//   }

//   return res.json({
//     message: "You don't have permission",
//   });
// }

// router.use("/reporter", isReporter, router_r.reporterC);
// router.use("/operator", isOperator, router_o.operatorC);
// router.use("/admin", isAdmin, router_a.adminC);


router.use("/reporter", router_r);
router.use("/operator", router_o);
router.use("/admin", router_a);

module.exports = router;
