var express = require("express");
var { db, init } = require("./database/dbinit.js");
const { setSchemaValidator } = require("./utils/utils.js");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const { v4 } = require("uuid");

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

  const token = await db.collection("Token").findOne({ token: authToken });
  if (!token) {
    const error = new Error("Unath");
    error.statusCode = 401;
    throw error;
    // res.status(401).send('No token!');
  }
  //TODO fix magi numbers

  if (Date.now() - token.created.getTime() > 1000 * 30 * 60) {
    // res.status(401).send('Expired Token');
    const error = new Error("Unath");
    error.statusCode = 401;
    throw error;
  }

  return await db.collection("User").findOne({ _id: token.userId });
}

app.post("/api/creatUsers/", async (req, res) => {
  try {
    //const loggedInUser = await authenticate(req, res);

    const result = await db.collection("User").insertOne({
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password),
      role: Roles.admin,
    });
    res.send(result.ops[0]);
  } catch (err) {
    res.send("User creation failed");
  }
});

app.post("/api/users/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await db.collection("User").findOne({ username });
    if (!user) {
      return res.status(401).send("Authentication failed");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send("Authentication failed");
    }

    const token = v4();
    await db
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
    const result = await db.collection("Issue").insert({
      status: IssueStatus.open,
      date: new Date(),
      author: user.username,
      // TODO description
    });
    res.send(result.ops[0]);
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
    return await db.collection('Issue').find(filter);

  } catch (err) { }
});
app.listen(3000, async () => {
  await init();
  console.log("Server started at 3000");
});
