//authorizing a user to have access to the account by using JWT to generate a token for a user when he/she tries to login 
//into the account using the password that match the one in the database

/**
 This code is a middleware function that authorizes a user to access the account by using JWT to generate a token for a 
 user when he/she tries to log in into the account using the password that matches the one in the database.

The protect middleware function checks if the Authorization header is present in the request and if it starts with the 
string "Bearer". If it does, it extracts the token from the header and verifies it using the jwt.verify() method and 
the JWT_SECRET environment variable

Overall, this code is a good example of how to use JWT to authorize users and protect routes in a Node.js application. 
It demonstrates how to verify a JWT token, retrieve the user from the database, and populate the req.user property with 
the user object. It also shows how to send a 401 Unauthorized response to the client if the token is invalid or not 
present
 */

import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModels";


const protect = asyncHandler (async (req, res, next)=>{
    let token;

    if( 
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];
            console.log(token)
            const decoded = jwt.verify(token, process.env.JWT_SECRET);  


            //check if the user exist before populating req.user
            const user= await User.findById(decoded.id).select("-password");

            if(!user){
                res.status(401);
                throw new Error("Not authorized - User not found" );
            }

            //let request a user
            req.user=user;
            next();
        } catch (error){
            console.error(error);
            res.status(401);
            throw new Error("Not authorized - Invalid token");
        }
    }

    if (!token){
        res.status(401);
        throw new Error("Not authorized - No token");
    }
});

export {protect};


     
