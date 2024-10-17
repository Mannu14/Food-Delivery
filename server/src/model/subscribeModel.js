const mongoose = require('mongoose');

const subscribeModelSechema = new mongoose.Schema({
    email:{
        type:String,
        unique:true
    }
},{timestamps:true});

const subscribeModel = new mongoose.model("subscribe", subscribeModelSechema);
module.exports = subscribeModel;