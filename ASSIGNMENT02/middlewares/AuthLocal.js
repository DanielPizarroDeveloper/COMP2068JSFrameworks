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
    secret: process.env.SESSION_SECRET || 'clave-super-secreta',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production' ? false : false, // TEMPORAL PARA PRUEBAS
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // Un día
    },
  }));
  app.use(passport.initialize());
  app.use(passport.session()); // DEBE estar después del middleware de sesiones
  
  
  passport.serializeUser((user, done) => {
    console.log('Serializando usuario:', user.id);
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    console.log('Intentando deserializar usuario con ID:', id); // Verifica que se ejecuta
    try {
      const user = await User.findById(id);
      console.log('Usuario deserializado:', user); // Verifica si el usuario se recupera correctamente
      done(null, user);
    } catch (error) {
      console.error('Error en deserialización:', error);
      done(error, null); // Llama a done con error si algo falla
    }
  });    

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
              console.log('Usuario guardado en la BD:', savedUser);
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
          console.log('Usuario guardado en la BD:', savedUser);
          return done(null, savedUser);
        }
      }
    ));
}

module.exports = {
    Auth_Options
}