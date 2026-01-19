const express = require("express");
const router = express.Router();
const {handleUserSignUp,handleUserLogIn} = require("../controllers/userControllers");



router.get("/",(req,res)=>{
    res.send("Welcome to PayTM Clone Backend");
});


router.post("/signup",handleUserSignUp);
router.post("/login",handleUserLogIn);

module.exports = router;