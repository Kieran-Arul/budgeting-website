/*********** GENERAL SET-UP ************/

const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.use(express.static("public"));

app.set("view engine", "ejs");

app.use(express.urlencoded({
  extended: true
}));

let authenticated = false;

/*********** API GET ENDPOINTS ************/

app.get("/", (_, res) => {
  res.sendFile(__dirname + "/client/homepage/index.html")
})

app.get("/signin", (_, res) => {
  res.sendFile(__dirname + "/client/sign-in/signin.html")
})

app.get("/signup", (_, res) => {
  res.sendFile(__dirname + "/client/sign-up/signup.html")
})

app.get("/signup", (_, res) => {
  res.sendFile(__dirname + "/client/sign-up/signup.html")
})

app.get("/mainmenu", (_, res) => {

  if (authenticated) {

    res.sendFile(__dirname + "/client/main-menu/main-menu.html")

  } else {

    res.redirect("signin")

  }

})

app.get("/configureExpenditureView", (_, res) => {
  res.sendFile(__dirname + "/client/configure-expenditure-view/configure-expenditure-view.html")
})

app.get("/logExpenditure", (_, res) => {
  res.sendFile(__dirname + "/client/log-expenditure/log-expenditure.html")
})

app.get("/logout", (_, res) => {
  authenticated = false;
  res.redirect("/");
})

/*********** API POST ENDPOINTS ************/

app.post("/signin", (req, res) => {

})

app.post("/signup", (req, res) => {

})

app.post("/viewExpenditure", (req, res) => {

})

app.post("/logExpenditure", (req, res) => {

})

/*********** EXPORTS ************/

module.exports = app;
