require("dotenv").config();
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
},mongoose.set('strictQuery', true)).then(() =>{
    console.log("connection is successful....");
}).catch((err) =>{
    console.log(`no connection ${err}`);
});