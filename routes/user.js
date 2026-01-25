const express = require("express");
const router = express.Router();
const {handleUserSignUp,handleUserLogIn,handleUserProfileEdit,handleFindUserBytext,handleGetUser} = require("../controllers/userControllers");
const {authenticateUser} = require("../middlewares/userMiddleWare");



router.get("/",(req,res)=>{
    res.send("Welcome to PayTM Clone Backend");
});


router.post("/signup",handleUserSignUp);
router.post("/login",handleUserLogIn);
router.put("/edit-profile",authenticateUser,handleUserProfileEdit);
router.get("/bulkSearch",authenticateUser,handleFindUserBytext);
router.get("/getuser",authenticateUser,handleGetUser);

module.exports = router;