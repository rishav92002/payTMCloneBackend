const express = require("express");
const router = express.Router();

const UserRouter = require("./user");
const AccountRouter = require("./account");

router.use("/account",AccountRouter);
router.use("/user",UserRouter);



module.exports = router;