const express = require("express");
const router = express.Router();
const { getUserFromToken } = require("../database/token.js");
const { executeHandler } = require("../utils/httpHandler");

const router_r = require("./private/reporter.js");
const router_o = require("./private/operator.js");
const router_a = require("./private/admin.js");
const { Roles } = require("../models/statusRoles.module.js");


function authenticateRoute(role) {
  return async (req, res, next) => {
    try {
      const authorization = req.headers.authorization;
      const user = await getUserFromToken(authorization);

      if (user.role !== role) {
        res.status(401).send('Unauthorized');
        return;
      }

      req.user = user;
      next();
    } catch (err) {
      res.status(err.statusCode || 500).send(err.message || 'Internal server error');
    }
  };


}


router.use("/reporter", express.Router().use(authenticateRoute('R')).use('/', router_r));
router.use("/operator", express.Router().use(authenticateRoute('O')).use('/', router_o));
router.use("/admin", express.Router().use(authenticateRoute('A')).use('/', router_a));

module.exports = router;
