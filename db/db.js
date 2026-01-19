const mongoose = require("mongoose");
const app_config = require("../configs/config");



const connectDB = async ()=>{
    try{
        await mongoose.connect(app_config.mongo_url);
        console.log("Connected to MongoDB");
    }catch(err){
        console.error("Error connecting to MongoDB:", err);
    }
}
module.exports = connectDB;