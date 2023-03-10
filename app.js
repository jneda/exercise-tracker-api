const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const logger = require("morgan");

const apiRoutes = require("./routes");

const app = express();

app.use(cors());

app.use(logger("dev"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api", apiRoutes);

app.get("/", (req, res) => {
  res.send("This is root.");
});

// catch all route
app.use((req, res, next) => {
  res.status(404).send("Resource could not be found.");
});

module.exports = app;
