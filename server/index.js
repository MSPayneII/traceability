require("dotenv").config();

// include and initialize the rollbar library with your access token
const express = require("express");
const cors = require("cors");
const app = express();

let Rollbar = require("rollbar");
let rollbar = new Rollbar({
  accessToken: "3120b794eb924901a98ec443f1a8396f",
  captureUncaught: true,
  captureUnhandledRejections: true,
});

// record a generic message and send it to Rollbar
rollbar.log("Hello world!");
rollbar.log("Added a .get!");

app.use(express.static("client"));

app.get("/", (req, res) => {
  res.sendFile("index.html");
});

const port = process.env.PORT || process.env.SERVER_PORT;

app.listen(port, () => console.log(`The port is running on: ${port}`));
