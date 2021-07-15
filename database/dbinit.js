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

  try {
    await db.collection("User").createIndex({ username: 1 }, { unique: true });
  } catch (err) {
    console.error("Error:", err);
  }

  const usersCsv = await csvtojson().fromFile("users.csv");
  await db.collection("User").bulkWrite(
    usersCsv.map((userData) => ({
      updateOne: {
        filter: { username: userData.username },
        update: { $set: userData },
        upsert: true,
      },
    }))
  );

  const hasIssues = await db.collection("Issue").countDocuments();
  if (!hasIssues) {
    const issuesCsv = await csvtojson().fromFile("issues.csv");
    await db.collection("Issue").insertMany(issuesCsv);
  }

  // csvtojson()
  //   .fromFile("issues.csv")
  //   .then((csvData) => {
  //     db.collection("Issue").insertMany(csvData, (err, res) => {
  //       if (err) throw err;
  //       // res.send("Cannot Update the Database!");
  //     });
  //   });

  //updated = true;
}

module.exports = {
  getDb() {
    return db;
  },
  init,
};
