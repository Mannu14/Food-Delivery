const mongoose = require("mongoose");
const { Counter, getNextSequence } = require('./Restaurant');

async function getNextOrderSequence(name) {
    return await getNextSequence(name);
}

const CommentsSchema = new mongoose.Schema({
        email: String,
        MenuId: [],
        Comment: String,
}, { timestamps: true });

// Schema for Orders
const ordersSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true
    },
    RestaurantId: String,
    RestaurantName: String,
    RestaurantImgSrc: String,
    deliveryTime: {
        type: Date,
    },
    statusSteps_id: {
        type: Number,
        default: 1
    },
    DeliveryAddress: [{
        area: String,
        district: String,
        pincode: String,
        state: String,
        Apartment: String,
        Building: String,
        Street: String
    }],
    status: {
        type: String,
        default: 'In-Progress'
    },
    amount: Number, // Store amount as a Number
    selectedPaymentMethod: String,
    items: [{
        MenuId: Number,
        itemName: String,
        itemImage: String,
        Quantity: Number,
        Price: Number,
    }],
    Comments: [CommentsSchema],
    deliveryBoysEmails: [{
        email: { type: String},
        restaurantUserEmail: { type: String},
        Accept: { type: String, default: '' },
        Reject: { type: String, default: '' },
        AcceptedOrRejectedTime: { type: Date },
        RestaurantAcceptOrReject: { type: String },
        RestaurantAcceptOrRejectTime: { type: Date },
        seen: { type: Boolean, default: false },
        isRestaurant: { type: Boolean, default: false },
        details:{},
        // deliveryBoydetails:{}
    }],
}, { timestamps: true });

ordersSchema.pre('save', async function (next) {
    if (!this.id) {
        this.id = await getNextOrderSequence('order');
    }
    next();
});

const employeeSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true, // Ensure email is unique
    },
    orders: [ordersSchema],
    deliveryBoy: {
        type: String,
        default: '0'
    },
    restaurant: {
        type: String,
        default: '0'
    },
}, { timestamps: true });

const userOrders = mongoose.model("userOrder", employeeSchema);
module.exports = userOrders;
