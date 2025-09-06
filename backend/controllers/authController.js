import {User} from '../models/User.js';
// import {Counselor} from '../models/Counselor.model.js'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import {json} from "express";
import { asyncHandler } from '../utils/asyncHandler.js'
import {ApiError} from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js";



const generateAccessAndRefereshTokens = async(userId) =>{
    try{
        const user = await User.findById(userId)    
        const accessToken = user.generateAccessToken() // see function in user.model
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken   // save refresh token on the server but not save access token on server
        await user.save({ validateBeforeSave: false })   // save on server without any validation or any field which is required but not send due to this it will save any how
     return {accessToken, refreshToken}  // retrunr tokens to client with containing the proper document from server
    }

    catch(error) {
        console.log(error);
        throw new ApiError(500, "something went wrong while generating access token & refresh token",error) 
    }
}

// Register User Logic
export const registerUser = asyncHandler( async ( req, res) =>{
  const { name, email, password } = req.body;
  if([name,email, password ].some((field)=>
    field?.trim() === "")) {
        throw new ApiError(400, "all fields are required")
    }
  
    let existedUser = await User.findOne({ email });
    if(existedUser){
        throw new ApiError(409, " user with this email or userName  already exists")
    }
      
    const user = await User.create({ name, email, password });
   
      const createdUser = await User.findById(user._id).select("-password -refreshToken")

      if(!createdUser){
        throw new ApiError(500, "something went wrong while registering user")
      }
      // ✅ Create Counselor profile if role is counselor
//   if (role === "counselor") {
//     await Counselor.create({
//       user: createdUser._id,
//       specializations: specializations || [],
//       bio: bio || "",
//       availability: availability || []
//     });
//   }

      return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered succesfully")
    )
    
    })
    
    //Rgister counsellor





// Login User Logic
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if(!email){
    throw new ApiError(400, "email is required")
  }
  
    let user = await User.findOne({ email });
    if (!user) {
       throw  new ApiError(404,"User does not exist")
    }
      const isPasswordValid = await user.isPasswordCorrect(password)
    if(!isPasswordValid){   
        throw new ApiError(401, "Invalid credentials")
    }
    
        const {accessToken,refreshToken}= await generateAccessAndRefereshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

        const options = {  //Instead of repeating attributes for each cookie() call, you define them once in the options object, making the code DRY (Don't Repeat Yourself). // reusability adds also.
        httpOnly: true, //This is a crucial security feature to mitigate cross-site scripting (XSS) attacks.
        secure: true  //The secure attribute ensures the cookie is only sent over HTTPS, never over unencrypted HTTP connections.// This protects the cookie from being intercepted by attackers via man-in-the-middle (MITM) attacks on unencrypted connections.
     }


     return res
     .status(200)
     .cookie("accessToken", accessToken, options)
     .cookie( "refreshToken", refreshToken, options)
     .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser,accessToken, refreshToken
            },
           user.role === "counselor"?  "Counselor logged in successfully" : "User logged in successfully"
        )
     )

    
})

// export const getUserProfile = async (req, res) => {
//     try {
//         // req.user is attached by the authMiddleware
//         const user = await User.findById(req.user.id).select('-password');
//         res.json(user);
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// };

export const logoutUser = asyncHandler(async (req, res) => {
    // Update refresh token to undefined in the database
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: { 
                 refreshToken: 1   // this removes the field from document
            },
        },
        {
            new: true, // Return the updated document
        }
    );

    // Define cookie options
    const options = {
        httpOnly: true,
        secure: true, // Set true if using HTTPS
    };

    // Clear cookies and send a success response
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
});


export const refreshAccessToken = asyncHandler(async(req, res) => {
const incomingRefreshToken = req.cookies.
refreshToken || req.body.refreshToken // last part  after || is for mobile users 

if(!incomingRefreshToken){
    throw new ApiError(401, "unauthorized request")
}
try {
    const decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
    )


    const user = await User.findById(decodedToken?._id)
    if(!user){
        throw new ApiError(401, "Invalid refresh token")
    }
    
    if(incomingRefreshToken !== user?.refreshToken){
        throw new ApiError(401, "Refresh token is expired or used")
    }
    
        const options = {
            httpOnly: true,
            secure: true
         }
    
         const {accessToken, newRefreshToken} = await generateAccessAndRefereshTokens(user._id)
    
         return res.status(200)
         .cookie("accessToken", accessToken, options)
         .cookie("refreshToken", newRefreshToken, options)
         .json(
            new ApiResponse(
                200,
                {accessToken, refreshToken: newRefreshToken},
                "Access token is refreshed"
            )
         )
} catch (error) {
    throw new ApiError(401, error?.message || 
        "Invalid refresh token"
    )
}
})

export const getCurrentUser = asyncHandler(async(req,res)=>{
    
      return res
      .status(200)
      .json(new ApiResponse(200, req.user, "current user fetched successfully"))

}) 