const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const userRouters = require("./routes/user.js");
const cookieSession = require("cookie-session");
const passport = require("passport");
const passportSetup = require("./config/passport-setup");
const bodyParser = require("body-parser");
const authRouters = require("./routes/auth-routes.js");
const session = require("express-session");

const app = express();
dotenv.config();

// view engine
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());
app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.KEY],
  })
);
// init passport
app.use(passport.initialize());
app.use(passport.session());

const LOCAL_DB = process.env.LOCAL_DB;
const PORT = process.env.PORT;

// ============================== connect to database ==============================
let connectPort = async (port) => {
  try {
    await mongoose.connect(LOCAL_DB);
    app.listen(port);
    console.log(`connect to database done at port ${port}!!`);
  } catch (err) {
    console.log(err);
  }
};
connectPort(PORT);
// user actions
app.use("/user", userRouters);
// authenticate with Google
app.use("/auth", authRouters);

// Swagger automatic generate documentation
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger-output.json");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
