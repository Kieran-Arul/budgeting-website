/*********** GENERAL SET-UP ************/

const express = require("express");
const app = express();

const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");
const saltRounds = 10;

app.use(express.static("public"));

app.set("view engine", "ejs");

app.use(express.urlencoded({
  extended: true
}));

let authenticated = false;
let currentUserEmail = null;

/*********** DATABASE CONNECTION ************/

mongoose.connect("mongodb://localhost:27017/budgetingWebsiteUsersDB")
    .then(() => console.log("Connected to Budgeting Website DB"))
    .catch(() => console.log("Connection to Budgeting Website DB failed"));

/*********** DATABASE SCHEMA SET-UP ************/

// Defines a schema that will be used for a collection (table) in the database
const userSchema = new mongoose.Schema({

  email: String,
  password: String,

  transactions: {
    type: Array,
    default: []
  }

});

// Creates a MongoDB collection (equivalent to table) called "Users" (Mongo automatically changes User to 
// Users). Documents in this particular collection will follow the schema of "userSchema" defined above
const User = new mongoose.model("User", userSchema);

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

  const userEmail = req.body.email;
  const userPassword = req.body.password;

  User.findOne({email: userEmail}, (err, returnedUser) => {

    if (err) {

      console.log(err);

    } else if (returnedUser) {

      bcrypt.compare(userPassword, returnedUser.password, (err, isCorrect) => {

        if (isCorrect === true) {

          authenticated = true;
          currentUserEmail = returnedUser.email;
          res.redirect("/mainmenu");

        }

      })

    }

    authenticated = false;
    res.redirect("/signin");

  })

})

app.post("/signup", (req, res) => {

  const userEmail = req.body.email;
  const userPassword = req.body.password;

  User.findOne({email: userEmail}, (err, returnedUser) => {

    // Email already exists
    if (returnedUser) {

      console.log(userEmail + " already exists");

      // Email does not exist but error occurred somewhere
    } else {

      if (err) {

        console.log(err);

        // No error but email but does not exist --> this must be a new user
      } else {

        bcrypt.hash(userPassword, saltRounds, (err, hashedPassword) => {

          // transactions: [] is added by default as defined in the schema above
          const newUser = new User({
            email: userEmail,
            password: hashedPassword
          });

          newUser.save()
              .then(() => {
                authenticated = true;
                currentUserEmail = userEmail;
                res.redirect("/mainmenu");
              })
              .catch(err => console.log(err));

        })

      }

    }

  });

})

app.post("/viewExpenditure", (req, res) => {

})

app.post("/logExpenditure", (req, res) => {

  const loggedItem = req.body.item;
  const loggedCost = req.body.cost;
  const loggedRetailer = req.body.retailer;
  const loggedDay = req.body.day;
  const loggedMonth = req.body.month;
  const loggedYear = req.body.year;

  if (currentUserEmail === null) {

    authenticated = false;
    res.redirect("/signin");

  } else {

    User.updateOne({email: currentUserEmail}, {

      $push: {

        transactions: {

          item: loggedItem,
          cost: loggedCost,
          retailer: loggedRetailer,
          day: loggedDay,
          month: loggedMonth,
          year: loggedYear

        }

      }

    })

    res.redirect("/mainmenu");

  }

})

/*********** EXPORTS ************/

module.exports = app;
