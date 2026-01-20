const express = require("express");
const router = express.Router();
const {authenticateUser} = require("../middlewares/userMiddleWare");
const {handleGetBalance, handleBalanceTransfer} = require("../controllers/accountControllers");


router.get("/balance",authenticateUser,handleGetBalance);
router.post("/transfer",authenticateUser,handleBalanceTransfer);



module.exports = router;