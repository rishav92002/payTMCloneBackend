const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const zod = require("zod");
const {authenticateUser} = require("../middlewares/userMiddleWare");
const User = require("../models/userModel");
const Account = require("../models/accountModel");
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
const editUserSchema = zod.object({
    firstName: zod.string().min(1).optional(),
    lastName: zod.string().min(1).optional(),
    email: zod.string().email().optional(),
    password: zod.string().min(8).optional()
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
        //create account for user
        const newAccount = new Account({
            userId: newUser._id,
            balance:  Math.random()*1000
        })
        await newAccount.save();
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
        const validPayload = await logInSchema.parse({email,password});
        if(!validPayload){
            return res.status(400).json({message:"Invalid data format"});
        }
        const user = await User.findOne({email});
        console.log('user found during login:', user);
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        const isPasswordValid = await bcrypt.compare(password,user.password);
        console.log('Password validation result:', isPasswordValid);
        
        if(!isPasswordValid){
            return res.status(401).json({message:"Invalid credentials"});
        }
        const token = await jwt.sign({email:user.email,id:user._id},app_config.jwt_secret,{expiresIn:"100h"});
        console.log('token',{token,email:user.email,id:user._id});
        
        res.status(200).json({message:"LoggedIn successful",token});
    }catch(err){
        res.status(500).json({message:"Internal Server Error",err});
    }
};
const handleUserProfileEdit = async (req,res)=> {
    try{
        const validPayload = editUserSchema.parse(req.body);
        if(!validPayload){
            return res.status(400).json({message:"Invalid data format"});
        }
        const userId = req.user.id;
        if(!userId){
            res.status(400).json({message:"User ID is required"});
        }
        const dataToBeupdated = req.body;
        if(!dataToBeupdated){
            return res.status(400).json({message:"No data provided for update"});
        }
        if(dataToBeupdated.password){
            dataToBeupdated.password = await bcrypt.hash(dataToBeupdated.password,10);
        }
        const updatedUser = await User.findByIdAndUpdate(userId,dataToBeupdated,{new:true});
        res.status(200).json({message:"User profile updated successfully",updatedUser});

       
    }catch(err){
        res.status(500).json({message:"Internal Server Error",err});
    }
}
const handleFindUserBytext = async (req,res)=>{
    try{
        const text = req.query.filter;
        console.log('req.query', req.query);
        
        if(!text){
            return res.status(400).json({message:"Search text is required"});
        }
        const users = await User.find({$or:[{firstName:{$regex:text,$options:"i"}},{lastName:{$regex:text,$options:"i"}}]});
        res.status(200).json({message:"Users fetched successfully",users:users.map(user=>({
            id:user._id,
            firstName:user.firstName,
            lastName:user.lastName}))});

    }catch(err){
        res.status(500).json({message:"Internal Server Error",err});
    }
}
module.exports = {
    handleUserSignUp,
    handleUserLogIn,
    handleUserProfileEdit,
    handleFindUserBytext
}