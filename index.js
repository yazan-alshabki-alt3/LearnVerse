const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const userRouters = require("./routes/user.js");
const bodyParser = require("body-parser");

const app = express();
dotenv.config();

// view engine
app.set("view engine", "ejs");
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());

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

app.use("/user", userRouters);

// Swagger automatic generate documentation
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger-output.json");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
