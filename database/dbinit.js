var dbConn = require("./dbConn.js");
const { setSchemaValidator } = require("../utils/utils.js");

var dbUpdate = function () {
    var _self = this;
    db = dbConn.db("roadIssues");
    // await setSchemaValidator(db, "User", {
    //     required: ["username", "password"],
    //     properties: {
    //       firstname:{
    //         bsonType: "string",   
    //       },
    //       lastname:{
    //         bsonType: "string",   
    //       },
    //       username: {
    //         bsonType: "string",
    //       },
    //       password: {
    //         bsonType: "string",
    //       },
    //       email:{
    //         bsonType: "string"  
    //       }
    //     },
    //   });
    _self.init = function () {
        console.log("ERda");
    };
};

module.exports = new dbUpdate();