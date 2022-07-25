/*********** GENERAL SET-UP ************/

const express = require("express");
const app = express();

const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");
const saltRounds = 10;

app.use(express.static("client"));

app.set("view engine", "ejs");

app.use(express.urlencoded({
  extended: true
}));

let authenticated = false;
let currentUserEmail = null;
let selectedTransactionData = [];

/*********** DATABASE CONNECTION ************/

mongoose.connect("mongodb://localhost:27017/budgetingWebsiteUsersDB")
    .then(() => console.log("Connected to Budgeting Website DB"))
    .catch(() => console.log("Connection to Budgeting Website DB failed"));

/*********** DATABASE SCHEMA SET-UP ************/

// Defines a schema that will be used for a collection (table) in the database
const userSchema = new mongoose.Schema({

  email: String,
  password: String,

  transactions: [{
    item: String,
    cost: String,
    retailer: String,
    date: Date,
    category: String
  }]

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

    res.redirect("/signin");

  }

})

app.get("/configureExpenditureView", (_, res) => {

  if (authenticated) {

    res.sendFile(__dirname + "/client/configure-expenditure-view/configure-expenditure-view.html");

  } else {

    res.redirect("/signin");

  }

})

app.get("/logExpenditure", (_, res) => {

  if (authenticated) {

    res.sendFile(__dirname + "/client/log-expenditure/log-expenditure.html");

  } else {

    res.redirect("/signin");

  }

})

app.get("/logout", (_, res) => {
  authenticated = false;
  res.redirect("/");
})

app.get("/getChartData", (_, res) => {

  if (authenticated) {

    res.send(selectedTransactionData);

  } else {

    res.redirect("/signin");

  }

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

        if (err) {
          res.redirect("/signin");
        }

        if (isCorrect === true) {

          authenticated = true;
          currentUserEmail = returnedUser.email;
          res.redirect("/mainmenu");

        } else {

          res.redirect("/signin");

        }

      })

    }

    else {
      res.redirect("/signin");
    }

  })

})

app.post("/signup", (req, res) => {

  const userEmail = req.body.email;
  const userPassword = req.body.password;

  User.findOne({email: userEmail}, (err, returnedUser) => {

    // Email already exists
    if (returnedUser) {

      console.log(userEmail + " already exists");
      res.redirect("/signup");

      // Email does not exist but error occurred somewhere
    } else {

      if (err) {

        console.log(err);
        res.redirect("/signup");

        // No error and email does not exist --> must be a new user
      } else {

        bcrypt.hash(userPassword, saltRounds, (err, hashedPassword) => {

          // transactions: [] is added by default as defined in the schema above
          const newUser = new User({
            email: userEmail,
            password: hashedPassword,
            transactions: []
          });

          newUser.save()
              .then(() => {
                authenticated = true;
                currentUserEmail = userEmail;
                res.redirect("/mainmenu");
              })
              .catch(err => {
                console.log(err);
                res.redirect("/signup");
              });

        })

      }

    }

  });

})

app.post("/viewExpenditure", (req, res) => {

  let transactionLog = [];

  const month = req.body.month;
  const year = parseInt(req.body.year);
  const budget = req.body.budget;

  const monthNameToIndex = {
    "January": 0,
    "February": 1,
    "March": 2,
    "April": 3,
    "May": 4,
    "June": 5,
    "July": 6,
    "August": 7,
    "September": 8,
    "October": 9,
    "November": 10,
    "December": 11,
  }

  if (currentUserEmail === null) {

    authenticated = false;
    res.redirect("/signin");

  } else {

    User.findOne({email: currentUserEmail}, (err, returnedUser) => {

      if (returnedUser) {

        for (let i = 0; i < returnedUser.transactions.length; i++) {

          if ((returnedUser.transactions[i].date.getFullYear() === year) && (returnedUser.transactions[i].date.getMonth()) === monthNameToIndex[month]) {
            transactionLog.push(returnedUser.transactions[i]);
          }

        }

        // Ensures all transactions are sorted by date
        // Logic of the sort function --> If left operand is greater than right operand, swap.
        // If equal or lesser than, do nothing.
        transactionLog.sort((a, b) => {
          return new Date(a.date) - new Date(b.date)
        })

        selectedTransactionData = transactionLog;

        let totalExpenditure = 0.0;

        for (let i = 0; i < selectedTransactionData.length; i++) {
          totalExpenditure += parseFloat(selectedTransactionData[i].cost);
        }

        let percentageOfBudgetSpent = (totalExpenditure/parseFloat(budget)) * 100;

        res.render("expenditure", {
          entries: transactionLog,
          percBudgetSpent: percentageOfBudgetSpent.toFixed(2),
          selectedMonth: month,
          selectedYear: year
        });

      } else {

        console.log(err);
        res.redirect("/configureExpenditureView");

      }

    })

  }

})

app.post("/logExpenditure", (req, res) => {

  const loggedItem = req.body.item;
  const loggedCost = req.body.cost;
  const loggedRetailer = req.body.retailer;
  const loggedDate = req.body.theDate;
  const loggedCategory = req.body.category;

  const unformattedDateString = loggedDate.split(/\D/);
  const formattedDateObj = new Date(unformattedDateString[0], --unformattedDateString[1], unformattedDateString[2]);

  if (currentUserEmail === null) {

    authenticated = false;
    res.redirect("/signin");

  } else {

    const newTransaction = {
      item: loggedItem,
      cost: loggedCost,
      retailer: loggedRetailer,
      date: formattedDateObj,
      category: loggedCategory
    };

    User.findOneAndUpdate({email: currentUserEmail}, { $push: { transactions: newTransaction }}, (err, _) => {

      if (err) {

        res.redirect("/logExpenditure");

      } else {

        res.redirect("/mainmenu");

      }

    })

  }

})

/*********** EXPORTS ************/

module.exports = app;
