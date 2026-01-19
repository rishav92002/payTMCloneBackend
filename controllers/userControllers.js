const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const zod = require("zod");
const User = require("../models/userModel");


const signUpSchema = zod.object({
    firstName: zod.string().min(1),
    lastName: zod.string().min(1),
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

module.exports = {
    handleUserSignUp
}