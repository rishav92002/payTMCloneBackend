const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const zod = require("zod");
const {authenticateUser} = require("../middlewares/userMiddleWare");
const User = require("../models/userModel");
const app_config = require("../configs/config");


const signUpSchema = zod.object({
    firstName: zod.string().min(1),
    lastName: zod.string().min(1),
    email: zod.string().email(),
    password: zod.string().min(8)
});
const logInSchema = zod.object({
    email: zod.string().email(),
    password: zod.string().min(8)
});
const handleUserSignUp = async (req,res)=>{
    try{
        const {firstName,lastName,email,password}= req.body;
        if(!firstName || !lastName || !email || !password){
            return res.status(400).json({message:"All fields are required"});
        }
        const validPayload = signUpSchema.parse({firstName,lastName,email,password});
        if(!validPayload){
            return res.status(400).json({message:"Invalid data format"});
        }
        const userExists = await User.findOne({email});
        if(userExists){
            return res.status(409).json({message:"User already exists"});
        }
        //hash password
        const hashedPassword = await bcrypt.hash(password,10);
        const newUser  = new User({
            firstName,
            lastName,
            email,
            password:hashedPassword
        });
        await newUser.save();
        res.status(201).json({message:"User registered successfully"});

    }catch(err){
        res.status(500).json({message:"Internal Server Error",err});
    }
}
const handleUserLogIn = async (req,res)=>{
    try{
        const {email,password}= req.body;
        if(!email || !password){
            return res.status(400).json({message:"All fields are required"});
        }
        const validPayload = logInSchema.parse({email,password});
        if(!validPayload){
            return res.status(400).json({message:"Invalid data format"});
        }
        const user = User.findOne({email});
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        const isPasswordValid = bcrypt.compare(password,user.password);
        console.log('Password validation result:', isPasswordValid);
        
        if(!isPasswordValid){
            return res.status(401).json({message:"Invalid credentials"});
        }
        const token = jwt.sign({email:user.email,id:user._id},app_config.jwt_secret,{expiresIn:"100h"});
        res.status(200).json({message:"LoggedIn successful",token});
    }catch(err){
        res.status(500).json({message:"Internal Server Error",err});
    }
};

module.exports = {
    handleUserSignUp,
    handleUserLogIn
}