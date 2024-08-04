const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/user.js");
const adminRoutes = require("./routes/admin.js");
const teacherRoutes = require("./routes/teacher.js");
const courseRoutes = require("./routes/course.js");
const dictionaryRoutes = require("./routes/dictionary.js");
const loveRoutes = require("./routes/love.js");
const subscribeRouts = require("./routes/subscribe.js");
const videoRoutes = require("./routes/video.js");
const grammarCheckerRoutes = require("./routes/grammarChecker.js");
const cookieSession = require("cookie-session");
const passport = require("passport");
const passportSetup = require("./config/passport-setup");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth-routes.js");
const session = require("express-session");
const translateRoutes = require("./routes/translate.js");
const app = express();
const cors = require('cors');


dotenv.config();

// view engine
app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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
app.use("/user", userRoutes);
// authenticate with Google
app.use("/auth", authRoutes);
// translate actions
app.use("/translate", translateRoutes);
// admin actions 
app.use("/admin", adminRoutes);
// teacher actions 
app.use("/teacher", teacherRoutes);
// grammar checker
app.use("/grammar-checker", grammarCheckerRoutes);
// course actions 
app.use("/course", courseRoutes);
// video actions 
app.use("/video", videoRoutes);
// dictionary actions 
app.use("/dictionary", dictionaryRoutes);
// loves actions 
app.use("/love", loveRoutes);
// subscribes actions 
app.use("/subscribe", subscribeRouts);



// Swagger automatic generate documentation
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger-output.json");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
