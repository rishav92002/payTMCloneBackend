const  dotenv =  require("dotenv");
dotenv.config();


const MONGO_URL = process.env.MONGO_URL;
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;

const app_config = {
    mongo_url: MONGO_URL,
    port: PORT,
    jwt_secret: JWT_SECRET
}
module.exports = app_config;