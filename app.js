/*********** GENERAL SET-UP ************/

const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.use(express.static("public"));

app.set("view engine", "ejs");

app.use(express.urlencoded({
  extended: true
}));

/*********** API ENDPOINTS ************/



/*********** EXPORTS ************/

module.exports = app;