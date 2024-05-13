import express from 'express';
import dotenv from 'dotenv';
import rateLimit from "express-rate-limit";
import passport from "passport";
import cors from "cors"; // Import the cors package
import jwt from "jsonwebtoken";
import helmet from "helmet";
import connectDB from './config/db.js';
import userRoutes from './Route/user.js';
import errorHandler from './middlewares/errorHandler.js'
import farmingTipsRoutes from './Route/farmingTips.js';
import "./models/userModel.js";
import ".config/passport.js";
import { protect } from "./middlewares/authentication.js";
import mongoose from 'mongoose';



const session = require('express-session');
const http = require('http').createServer(app);
//const io = require('socket.io')(http);

dotenv.config();

const app = express();


//origins will be modified
const allowedOrigins = [
  "https://DigiEXT.vercel.app",
  "http://localhost:5001",
];


//weatherUpdate using Socket.io
app.get('/weather-update', (req, res)=>{

  const weatherData = {temperature: 20, description: 'Sunny'};
  io.emit('weather-update', weatherData);  //emmiting weather data 
  res.json('WeatherData');
});

//const socket = io();
//socket.on('weather-update', (weatherData) => {
  //console.log('Weather update received:', weatherData);
  // Update the UI with the new weather data
//});


app.use(
  session({
    secret: process.env.cookieKey, // Replace with your own secret key
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(cors({
  origin: allowedOrigins,
  
  credentials: true, // Allow credentials (e.g., cookies)
}));


app.set("trust proxy", 1);

// Rate limiter options
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});


// Apply the rate limiter to all requests
app.use(limiter);

app.use(express.json());

app.disable("x-powered-by");
app.use(express.urlencoded({ extended: false }));
app.use(helmet());

const port = 5001;


// google routes
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

app.get(
  "/auth/google/callback",
  passport.authenticate("google"),
  (req, res) => {
    const user = req.user;
    const userData = {
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      token: generateToken(user.id),
    };
    const userJson = JSON.stringify(userData);

    // Redirect back to the client with the token as a query parameter
    const redirectUrl = //modified wiht the server url

    res.redirect(redirectUrl);
  }
);


app.use("/api/user", userRoutes);
app.use("/api/farmingTips", farmingTipsRoutes);

app.get("/", async (req, res) => {
  res.status(200).json({
    status: "200",
    message: "Server online",
  });
});


app.use(errorHandler);
connectDB().then(() => {
  app.listen(port, async() => {
    console.log("listening for requests");
  });
});

