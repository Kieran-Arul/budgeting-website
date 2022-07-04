/*********** SERVER START ************/

const app = require(__dirname + "/app.js");

app.listen(8000, () => {
    console.log("Server running on Port 8000");
});