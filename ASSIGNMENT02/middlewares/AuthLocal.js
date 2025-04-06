//import passport express-session
var passport = require('passport');
var User = require('../models/user');
var configs = require('../configs/globals');
var githubStrategy = require('passport-github2').Strategy;
var googleStrategy = require('passport-google-oauth20').Strategy;
const MongoStore = require('connect-mongo');
const session = require('express-session');

const Auth_Options = (app) => {
  app.use(session({
    store: MongoStore.create({
      mongoUrl: process.env.CONNECTION_STRING_MONGODB,
      ttl: 14 * 24 * 60 * 60,
    }),
    secret: process.env.SESSION_SECRET || 'secret-password',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 1000 * 60 * 60 * 24,
    },
  }));

  app.use(passport.initialize());
  app.use(passport.session());
  
  // passport.serializeUser((user, done) => {
  //   console.log('Flag: serializeUser');
  //   done(null, user.id);
  // });

  // passport.deserializeUser(async (id, done) => {
  //   console.log('Flag: deserializeUser');
  //   try {
  //     const user = await User.findById(id);
  //     done(null, user);
  //   } catch (error) {
  //     done(error, null);
  //   }
  // });    

  local_Auth();
  Google_Auth();
  Github_Auth();

  passport.use('local', User.createStrategy());
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());
}

const local_Auth = () => {
    passport.use('local', User.createStrategy());
}

const Google_Auth = () => {
    passport.use(
      new googleStrategy(
        {
          clientID: configs.Google.clientId,
          clientSecret: configs.Google.clientSecret,
          callbackURL: configs.Google.callback,
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const user = await User.findOne({ oauthId: profile.id });
            if (user) {
              return done(null, user);
            } else {
              const newUser = new User({
                username: profile.displayName,
                email: profile.emails[0].value,
                oauthId: profile.id,
                oauthProvider: 'Google',
              });
              const savedUser = await newUser.save();
              return done(null, savedUser);
            }
          } catch (error) {
            return done(error, null);
          }
        }
      )
    );
}

const Github_Auth = () => {
    passport.use('github',
      new githubStrategy ({
        clientID: configs.GitHub.clientId,
        clientSecret: configs.GitHub.clientSecret,
        callbackURL: configs.GitHub.callback
      },
      async (accessToken, refreshToken, profile, done) => {
        const user = await User.findOne({ oauthId: profile.id });
        if (user) {
          return done(null, user);
        }
        else {
          const newUser = new User({
            username: profile.displayName,
            email: profile.username,
            oauthId: profile.id,
            oauthProvider: 'GitHub'
          });
          const savedUser = await newUser.save();
          return done(null, savedUser);
        }
      }
    ));
}

module.exports = {
    Auth_Options
}