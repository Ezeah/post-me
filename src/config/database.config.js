const mongoose = require("mongoose");
const constants = require("../utilities/constants.utilities");

function database() {
 mongoose
.set("strictQuery", true)
.connect(process.env.MONGODB_URL,
    {useNewUrlParser: true, useUnifiedTopology: true},()=>{
    console.log('connected to mongoDB')
});
(error) => {
    if (error) {
      return console.log("error connecting to mongoDB");
    }
  }
}

module.exports = database;
