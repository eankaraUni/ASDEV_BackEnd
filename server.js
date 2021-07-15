var express = require("express");
var { getDb, init } = require("./database/dbinit.js");
const { setSchemaValidator } = require("./utils/utils.js");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const { v4 } = require("uuid");
const mongo = require("mongodb")
// const { ReturnDocument } = require("mongodb");

const app = express();
app.use(bodyParser.json());

app.get("/", function (req, res) {
  res.send("Hello World");
});
const IssueStatus = {
  open: "O",
  inProgress: "P",
  solved: "S",
};

const Roles = {
  admin: "A",
  reporter: "R",
  operator: "O",
};

async function authenticate(req, res) {
  const { authorization } = req.headers;
  if (!authorization) {
    const error = new Error("Unath");
    error.statusCode = 401;
    throw error;
    // res.status(401).send('Unauth');
  }

  const authToken = authorization.split(" ")[1];

  const token = await getDb().collection("Token").findOne({ token: authToken });
  if (!token) {
    const error = new Error("Unathorized ");
    error.statusCode = 401;
    throw error;
    // res.status(401).send('Your Session Expired');
  }
  //TODO fix magi numbers
  if (Date.now() - token.created.getTime() > 1000 * 30 * 60) {
    //res.status(401).send('Expired Token');
    const error = new Error("Unath");
    error.statusCode = 401;
    throw error;
  }
  else{
  return await getDb().collection("User").findOne({ _id: token.userId });}
}

app.post("/api/createUsers/", async (req, res) => {
  try {
    //const loggedInUser = await authenticate(req, res);

    const result = await getDb()
      .collection("User")
      .insertOne({
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password),
        role: Roles.admin,
      });
    res.send(result.ops[0]);
  } catch (err) {
    res.send("User creation failed");
  }
  // res.send(req.body);
});

app.post("/api/users/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await getDb().collection("User").findOne({ username });
    if (!user) {
      return res.status(401).send("Authentication failed");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send("Authentication failed");
    }

    const token = v4();
    await getDb()
      .collection("Token")
      .insertOne({ userId: user._id, token, created: new Date() });

    res.send({
      user: { username: user.username },
      token,
    });
  } catch (err) {
    res.status(401).send("Authentication failed");
  }
});

// {description: '00fasdfdsfasdfasdfsd'}
app.post("/api/issues", async (req, res) => {
  try {
    //Here fix Admin and reporter... They can not add Issues only Update them !!
    const user = await authenticate(req, res);
    if(user.role === Roles.reporter){
    const result = await getDb().collection("Issue").insert({
      status: IssueStatus.open,
      date: new Date(),
      author: user.username,
      // TODO description
    });
    res.send(result.ops[0]);

    }
    else {
        res.send("Only Reporters can report Road Issues");
    }

  } catch (err) {
    res.status(err.statusCode || 500).send(err.message || "Unexpected error");
  }
});

app.get("/api/issues", async (req, res) => {
  try {
    const user = await authenticate(req, res);

    const filter = {};
    if (user.role === Roles.operator) {
      filter.assignedUser = user.username;
    }
    if (user.role === Roles.reporter) {
      filter.author = user.username;
    }
    return await getDb().collection("Issue").find(filter);
  } catch (err) {}
});

/**
 * @param {Object} data
 * @param {string} data.description
 * @param {string} data.streetAddress
 * @returns {*}
 */
function buildIssue(data) {
  return {
    Description: data.description,
    status: data.status,
    streetAddress: data.streetAddress,
    City: data.City,
    Country: data.Country,
    raportedDate: data.raportedDate,
    author: data.Author,
    assignedUser: data.assignedUser,
  };
}

app.post("/api/addIssues", async (req, res) => {
  try {
    const loggedInUser = await authenticate(req, res);
    const { description, streetAddress, city, country } = req.body;

    const issue = buildIssue({
      status: IssueStatus.open,
      streetAddress,
      description,
      city,
      country,
      raportedDate: new Date(),
      author: loggedInUser.username,
      assignedUser: 'admin'
    });
    const result = await getDb().collection("Issue").insertOne(issue);
    issue._id = result.insertedId;
    res.send(issue);
  } catch (err) {
    res.send("Issue creation failed");
  }
});
app.put("/api/updateIssue/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const loggedInUser = await authenticate(req, res);
    const AuthorData = await getDb().collection("Issue").findOne({"author": loggedInUser.username});
    if (AuthorData){
    const issue = {};
    for(let prop in req.body) if(req.body[prop]) issue[prop] = req.body[prop];
    issue.Author = loggedInUser.username;
    const result = await getDb().collection("Issue").updateOne({"_id" : new mongo.ObjectId(id)},{$set: issue }, {upsert: true});
    issue._id = result.insertedId;
    res.send(issue);
    }
    else
    {
        res.send("Only the author can update an issue");
    }
  } catch (err) {
    res.send("Issue Updating failed");
  }
});

app.listen(3000, async () => {
  await init();
  console.log("Server started at 3000");
});
