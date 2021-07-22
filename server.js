const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require('cors');

const { init } = require("./database/dbinit.js");

const router_auth = require('./controller/auth')
const router_private = require('./controller/private')



app.use(cors({
    origin: '*'
}));
app.use(bodyParser.json());

app.use('/api', router_auth);
app.use('/private', router_private);
app.get('/testing', async (req, res) => {
  res.send("Here");
});

app.listen(3000, async () => {
    await init();
    console.log("Server started at 3000");
  });