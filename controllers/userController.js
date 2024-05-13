// login a user, register a user and protect a user

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import asyncHandler from "express-async-handler";
import User from "../models/userModels.js";



//REGISTER A USER
/**
before you register a user, you check if the name, email and password provided is not required, offcourse they supposed to be required

you check if a user exist using FINDONE by an email

you hash the user password using bcrypt 

you then create a user with the name, email and a harsh password. if it useer, you generate a
specific id and generate a tokenId for the user else throw an error, user not registered
 */
const registerUser= asyncHandler (async (req, res) =>{
    let {name, email, password}= req.body;


    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please add all required fields. ");
      }
    
      // Convert name and email to lowercase
      name = name.toLowerCase();
      email = email.toLowerCase();
    


  //check if user exist
const userExist = await User.findOne({email});
if (userExist){
    res.status(400);
    throw new Error("User already exist. ");
}

 //hash password
 const salt= await bcrypt.genSalt(10);
 const hashPassword = await bcrypt.hash(password, salt);

 //create user
 const user = await User.create({
    name,
    email,
    password: hashPassword,
 });

  
  if (user) {
    res.status(200).json({
        _id: user.id,
        name: user.name,
        credits: user.credit,
        email: user.email,
        token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("User not registered. ");
  }
});


//  LOGIN A USER
/**
 we login a user with email and a password

 we compare the provided password with the harshed on and if it matches we throw res.json with a unique id and generate a toke

 if it doesnt match else, throw new error saying user credebtials do not match

 else throw new error Use Google authentication 

 else throw new error User not found 
 */
const loginUser = asyncHandler(async (req, res) =>{
    let {email,password} = req.body;
    email=email.toLowerCase();
    const user= await User.findOne({email});


 if (user){
    if(user.password){
        if(await bcrypt.compare(password, user.password)){  //if password provided is equal to harsh password, then
            res.json({ 
            _id: user.id,
            name: user.name,
            email: user.email,
            credits: user.credit,
            token: generateToken(user._id),
            });
        }else {
            res.status(404);
            throw new Error("User credentials do not match");
        }
    }else{
        res.status(400);
        throw new Error("Use Google auth");
    }
 }else {
    res.status(404);
    throw new Error("User not found");
 }
});



//GET USER
/**
 get a user by the id, name, email and a profileImage

 you then generate a token for the specif user with expiration period of 30days
 */
const getMe = asyncHandler(async (req, res)=>{
    const user ={
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        profileImage: req.user.profileImage
    }
    res.status(200).json(user);
});

//Generate JWT
const generateToken =(id)=>{
    return jwt.sign({ id }, process.env.JWT_SECRET, {expiresIn: "30d"});
}

export {registerUser, loginUser, getMe};



