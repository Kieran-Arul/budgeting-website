/*********** SERVER START ************/

const app = require(__dirname + "/app.js");

app.listen(8080, () => {
    console.log("Server running on Port 8080");
});
