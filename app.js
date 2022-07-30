/*********** GENERAL SET-UP ************/

const fs = require("fs").promises;
const express = require("express");
const app = express();

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

/*********** HELPER FUNCTIONS ************/

async function readAsJson(filepath) {

  try {

    const rawJsonString = await fs.readFile(filepath, "utf8");

    return JSON.parse(rawJsonString);

  }

  catch (err) {
    console.log(err);
  }

}

async function writeToJson(filepath, data) {

  let newData = JSON.stringify(data, null, 2);

  try {
    await fs.writeFile(filepath, newData, "utf8");
  }

  catch (err) {
    console.log(err);
  }


}

/*********** API POST ENDPOINTS ************/

app.post("/signin", async (req, res) => {

  const userEmail = req.body.email;
  const userPassword = req.body.password;

  let users = await readAsJson("users.json");

  if (!(users[userEmail] === undefined)) {

    bcrypt.compare(userPassword, users[userEmail].password, (err, isCorrect) => {

      if (err) {
        res.redirect("/signin");
      }

      if (isCorrect === true) {

        authenticated = true;
        currentUserEmail = userEmail;
        res.redirect("/mainmenu");

      } else {

        res.redirect("/signin");

      }

    })

  } else {
    res.redirect("/signin");
  }

})

app.post("/signup", async (req, res) => {

  const userEmail = req.body.email;
  const userPassword = req.body.password;

  let users = await readAsJson("users.json");

  // User does not exist --> signing up is valid
  if (users[userEmail] === undefined) {

    try {

      let hashedPassword = await bcrypt.hash(userPassword, saltRounds)

      users[userEmail] = {
        password: hashedPassword,
        transactions: []
      }

      await writeToJson("users.json", users);

      authenticated = true;
      currentUserEmail = userEmail;
      res.redirect("/mainmenu")

    } catch (err) {

      res.redirect("/signup");

    }

  } else {

    console.log(userEmail + " already exists");
    res.redirect("/signup");

  }

})

app.post("/viewExpenditure", async (req, res) => {

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

    let users = await readAsJson("users.json");

    let userTransactions = users[currentUserEmail].transactions;

    for (let i = 0; i < userTransactions.length; i++) {

      // Convert strings saved in the JSON file back into Date objects
      // Reason: saving the Date object into the JSON file and does not preserve its Date object property
      // It is simply saved as a string which then needs to be parsed and converted to a Date object again
      userTransactions[i].date = new Date(Date.parse(userTransactions[i].date));

      if ((userTransactions[i].date.getFullYear() === year) && (userTransactions[i].date.getMonth() === monthNameToIndex[month])) {
        transactionLog.push(userTransactions[i]);
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
      percentageBudgetSpent: percentageOfBudgetSpent.toFixed(2),
      selectedMonth: month,
      selectedYear: year
    });

  }

})

app.post("/logExpenditure", async (req, res) => {

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

    let users = await readAsJson("users.json");

    users[currentUserEmail].transactions.push(newTransaction)

    try {

      await writeToJson("users.json", users);

      res.redirect("/mainmenu");

    } catch (err) {

      console.log(err);
      res.redirect("/logExpenditure");

    }

  }

})

/********** EXPORTS ***********/

module.exports = app;
