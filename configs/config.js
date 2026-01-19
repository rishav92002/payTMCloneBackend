const  dotenv =  require("dotenv");
dotenv.config();


const MONGO_URL = process.env.MONGO_URL;
const PORT = process.env.PORT || 3000;

const app_config = {
    mongo_url: MONGO_URL,
    port: PORT
}
module.exports = app_config;