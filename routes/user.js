const express = require("express");
const router = express.Router();




router.get("/",(req,res)=>{
    res.send("Welcome to PayTM Clone Backend");
});


router.post("/signup",(req,res)=>{
    try{
        const {firstname,lastname,email,password}= req.body;
        if(!firstname || !lastname || !email || !password){
            return res.status(400).json({message:"All fields are required"});
        }
        
        
    }catch(err){
        
    }
});



module.exports = router;