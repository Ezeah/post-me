const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const userRouter = require("./routes/user.route"); 
const database = require('./config/database.config');
dotenv.config();
const constants = require("./utilities/constants.utilities");
const { MESSAGES } = constants;
app.use(cors({ origin: "*" }));
app.use(helmet());
app.use(morgan('common'));
app.use(userRouter);
app.use(express.json());
database();

app.get("/", (req, res) => {
    res.status(200).send({ message: MESSAGES.FETCHED, success: true });
  });

app.listen(8000,()=>{
    console.log('server is up and running...')
})