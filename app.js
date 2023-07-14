const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const appRouter = require("./routes/allroutes");
const logger = require("morgan");
const passport = require("passport");
const flash = require("express-flash");
const compression = require("compression"); //for production
const helmet = require("helmet"); // for http headers config in production
const rateLimit = require("express-rate-limit"); // for limiting the number of request from one widow in a given duration on production
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
const authStrategy = require("./helpers/passportConfig");
authStrategy(passport);

const session = require("express-session");

if (process.env.NODE_ENV !== "production") require("dotenv").config(); // to put .env variables into process env
const port = process.env.PORT;
//connnect to db
const mongdbURI = process.env.MONGODB_URI;
main()
  .then(console.log("successfull connection to db"))
  .catch((error) => console.log("error connection to database", error));
async function main() {
  await mongoose.connect(mongdbURI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
}

app.use(helmet());
app.use(logger("dev"));
app.use(express.json()); // to parse incoming json data in http requests
// set static folder and view engine
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(compression());
app.use(express.static(path.join(__dirname, "public"))); //static folder
app.set("view engine", "pug"); // set pug as view engine. note that by default views folder is set to views in the route directory if any
app.use(express.urlencoded({ extended: false })); // to parse form data
// use routes
app.use(limiter);
app.use(appRouter);
//listening
app.listen(port, () => console.log("server running on port: " + port));
