const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./db/db');
const appConfig= require('./configs/config');
const mainRouters = require('./routes/index');
const app = express();
//db connection
connectDB();
// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.json())

// routes

app.use("/api/v1",mainRouters);



//
app.listen(appConfig.port,()=>{
    console.log(`Server is running on http://localhost:${appConfig.port}`);
});
