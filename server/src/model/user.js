const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const employeeSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        unique: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: Number,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    confirmpassword: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    deliveryBoy: [{
        admin: {
            type: String,
            default: '0'
        },
        frontImage: String,
        rearImage: String,
        dutyStartTime: String,
        dutyEndTime: String,
        vehicleNumber: String,
        currentLocation: String,
        currentStatus: String,
        DeliveriesCompleted: String,
        Ratings: [{
            Rating: Number,
            RatingCount: Number
          }],

    }],
    restaurant: {
        type: String,
        default: '0'
    },
},
    { timestamps: true });


employeeSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
        this.confirmpassword = await bcrypt.hash(this.confirmpassword, 10);
    }
    next();
});

const Register = new mongoose.model("users", employeeSchema);
module.exports = Register;