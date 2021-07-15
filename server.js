var express = require("express");
var { db, init } = require("./database/dbinit.js");
// var dbConn = require("./database/dbConn.js");
// dbUpdate.init();
// dbConn.client;
const { setSchemaValidator } = require("./utils/utils.js");

// /**@type {import('mongodb').Db} */
// let db;

var app = express();
//app.use(bodyParser.json());

app.get("/", function (req, res) {
  res.send("Hello World");
});
app.listen(3000, async () => {
  await init();
  console.log("Server started at 3000");
  // db = dbConn.db("roadIssues");
  // await setSchemaValidator(db, "User", {
  //   required: ["username", "password"],
  //   properties: {
  //     username: {
  //       bsonType: "string",
  //     },
  //     password: {
  //       bsonType: "string",
  //     },
  //   },
  // });
});
