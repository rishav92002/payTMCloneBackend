const jwt = require("jsonwebtoken");
const app_config = require("../configs/config");

const authenticateUser = async (req,res,next)=>{
    try{
        const authorizationHeader = req.headers.authorization;
        if(!authorizationHeader || !authorizationHeader.startsWith("Bearer")){
            return res.status(401).json({message:"Unauthorized: Invalid token format or no token provided"});
        }
        const token = req.headers.authorization?.split(" ")[1];
        if(!token){
            return  res.status(401).json({message:"Unauthorized: No token provided"});
        }
        const decoded = await jwt.verify(token,app_config.jwt_secret);
        if(!decoded){
            return res.status(401).json({message:"Unauthorized: Invalid token"});
        }
        req.user = decoded;
        next();

    }catch(err){
        res.status(500).json({message:"Internal Server Error",err});
    }
};


module.exports = {
    authenticateUser
}