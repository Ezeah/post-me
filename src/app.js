const express = require('express');
const app = express();
const dotenv = require('dotenv');
const database = require('./config/database.config');
dotenv.config();
const constants = require("./utilities/constants.utilities");
const { MESSAGES } = constants;
app.use(express.json());
database();

app.listen(8000,()=>{
    console.log('server is up and running...')
})