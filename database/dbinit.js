const { setSchemaValidator } = require("../utils/utils.js");
const { MongoClient } = require("mongodb");

/**@type {import('mongodb').Db} */
let db;

async function init() {
  const client = await MongoClient.connect("mongodb://localhost:27017", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    //native_parser: false
  });
  db = client.db("RoadIssues");

  await populateDb();
}

async function populateDb() {
  await setSchemaValidator(db, "User", {
    required: ["username", "password"],
    properties: {
      firstname: {
        bsonType: "string",
      },
      lastname: {
        bsonType: "string",
      },
      username: {
        bsonType: "string",
      },
      password: {
        bsonType: "string",
      },
      email: {
        bsonType: "string",
      },
    },
  });
  //   _self.init = function () {
  //     console.log("ERda");
  //   };
}

module.exports = { db, init };
