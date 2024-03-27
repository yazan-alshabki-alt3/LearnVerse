const passport = require("passport");
const jwt = require("jsonwebtoken");
const GoogleStrategy = require("passport-google-oauth20");
require("dotenv").config();
const User = require("../models/User");

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/redirect",
      scope: ["profile", "email"], // Add 'email' to the scope
    },
    (accessToken, refreshToken, profile, done) => {
      console.log("callback function fired ");
      const email = profile.emails[0].value;
      User.findOne({ email: email }).then((currentUser) => {
        if (currentUser) {
          // already have a user
          console.log("user is already registered", currentUser);
          done(null, currentUser);
        } else {
          // if not create user in our db
          new User({
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            photo: profile._json.picture,
            email: email,
            authenticated: "Google",
          })
            .save()
            .then((newUser) => {
              console.log(newUser);
              done(null, newUser);
            });
        }
      });
    }
  )
);
