const express = require("express");
const { getDb, init } = require("./database/dbinit.js");
// const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
// const { v4 } = require("uuid");
// const mongo = require("mongodb");
// const {executeHandler}  = require("./utils/httpHandler");
const cors = require("cors");
const router_auth = require('./controller/auth')
const router_private = require('./controller/private')

const app = express();
// app.use(cors);
app.use(bodyParser.json());
app.use('/api', router_auth.auth);
app.use('/private', router_private.private);

app.listen(3000, async () => {
    await init();
    console.log("Server started at 3000");
  });