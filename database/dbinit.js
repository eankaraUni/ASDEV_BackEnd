const { setSchemaValidator } = require("../utils/utils.js");
const { MongoClient } = require("mongodb");
const csvtojson = require("csvtojson");

/**@type {import('mongodb').Db} */
let db;
//var updated = false;
async function init() {
  const client = await MongoClient.connect("mongodb://localhost:27017", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    //native_parser: false
  });
  db = client.db("RoadIssues");
  //if(updated === false){
  await populateDb();
  //}
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

  csvtojson().fromFile("users.csv").then(csvData => {
    db.collection("User").insertMany(csvData, (err, res) => {
      if (err) throw err;
        // res.send("Cannot Update the Database!");
      });

  });

  csvtojson().fromFile("issues.csv").then(csvData => {
    db.collection("Issue").insertMany(csvData, (err, res) => {
      if (err) throw err;
        // res.send("Cannot Update the Database!");
      });

  });

  //updated = true;

}

module.exports = { db, init };
