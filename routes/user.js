const express = require("express");
const router = express.Router();
const {handleUserSignUp} = require("../controllers/userControllers");



router.get("/",(req,res)=>{
    res.send("Welcome to PayTM Clone Backend");
});


router.post("/signup",handleUserSignUp);



module.exports = router;