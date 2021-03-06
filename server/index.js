require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();

// include and initialize the rollbar library with your access token
let Rollbar = require("rollbar");
let rollbar = new Rollbar({
  accessToken: "3120b794eb924901a98ec443f1a8396f",
  captureUncaught: true,
  captureUnhandledRejections: true,
});

// record a generic message and send it to Rollbar
// rollbar.log("Hello world!");
rollbar.log("Checking");

let students = ["Sam", "Bradley", "Irene", "Michael"];

app.use(express.json());
app.use(cors());

// app.use(express.json());

app.use(express.static("client"));
app.get("/", (req, res) => {
  res.sendFile("index.html");
  rollbar.log("got the index.html file");
});

// app.get("/main");

app.get("/api/students", (req, res) => {
  rollbar.info("Someone got the list of students on page load");
  console.log("made the get");
  res.status(200).send(students);
});

app.post("/api/students", function (req, res) {
  let { name } = req.body;

  const index = students.findIndex((student) => {
    return student === name;
  });

  try {
    if (index === -1 && name !== "") {
      students.push(name);
      rollbar.info("Someone added a student");
      res.status(200).send(students);
    } else if (name === "") {
      rollbar.critical("Someone tried to enter a blank student");

      res.status(400).send("must provide a name");
    } else {
      rollbar.error("Someone tried to enter a duplicate student name");
      res.status(400).send("that student already exists");
    }
  } catch (err) {
    console.log(err);
    rollbar.error(err);
  }
});

app.delete("/api/students/:index", (req, res) => {
  const targetIndex = +req.params.index;

  students.splice(targetIndex, 1);

  rollbar.info("Someone deleted a student");
  res.status(200).send(students);
});

const port = process.env.PORT || process.env.SERVER_PORT;

app.listen(port, () => console.log(`The port is running on: ${port}`));
