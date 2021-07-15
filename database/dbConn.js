const { MongoClient} = require("mongodb").MongoClient;

const client = new MongoClient.connect("mongodb://localhost:27017",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
    //native_parser: false
  });

// db = await client.db("roadIssues");
// // var _self = this;

// //     _self.init = function () {
        // console.log("DB Working");
//     // };

module.exports = {client : client};