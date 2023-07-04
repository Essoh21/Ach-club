const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const appRouter = require("./routes/allroutes");
const logger = require("morgan");

require("dotenv").config(); // to put .env variables into process env
const port = process.env.PORT;

//connnect to db
const mongdbURI = process.env.MONGODB_URI;
main()
  .then(console.log("successfull connection to db"))
  .catch((error) => console.log("error connection to database", error));
async function main() {
  await mongoose.connect(mongdbURI);
}

app.use(logger("dev"));
app.use(express.json()); // to parse incoming json data in http requests
// set static folder and view engine
app.use(express.static(path.join(__dirname, "public"))); //static folder
app.set("view engine", "pug"); // set pug as view engine. note that by default views folder is set to views in the route directory if any
app.use(express.urlencoded({ extended: false })); // to parse form data
// use routes
app.use(appRouter);
//listening
app.listen(port, () => console.log("server running on port: " + port));
