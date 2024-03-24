import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import userRouters from "./routes/user.js";
import bodyParser from "body-parser";

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
