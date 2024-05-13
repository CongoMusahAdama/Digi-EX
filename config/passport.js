//ago modify am
//the purpose of a passport in Express is to authenticate and authorize incoming requests to secure routes or API

/**
 * this code is a good example of how to use Passport.js to authenticate and authorize incoming
 *  requests to secure routes or APIs using Google authentication. It demonstrates how to serialize
 *  and deserialize user instances, configure a Google authentication strategy, and load environment variables from a .env file.
 */

import GoogleStrategy from "passport-google-oauth20";
import User from "../models/userModels";
import passport from "passport";
import dotenv from "dotenv";
dotenv.config();

// Configure Passport.js to serialize and deserialize user instances

passport.serializeUser((user, done)=>{ //converting the user object to string using the user ID
  done(null, user.id)
});

passport.deserializeUser((id, done)=>{
  User.findById(id).then((user)=>{
    done(null, user);
  });
});



// Configure Passport.js with Google authentication strategy (authentication with Google strategy )
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID, 
      CLIENT_SECRET: process.env.CLIENT_SECRET, 
      callbackURL: "/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done)=>{
      User.findOne({email: profile.emial[0].value}).then((existingUser)=>{

        if(existingUser){
          done(null, existingUser);
        }else{
          new User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            profileImage: profile.photos[0].value,
          })
          .save()
          .then((user)=>{
            done(null, user);
          });
        }
      })
    }
  )
);
/* ========= DATABASE CHECK PRE EXIST AND INSERT QUERY: END =========  */
