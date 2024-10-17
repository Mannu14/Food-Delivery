require('dotenv').config();
const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
var cors = require("cors");
const cookieParser = require("cookie-parser");
const auth = require("../src/middleware/auth");

const userController = require('../Controller/userController');


const session = require('express-session');
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use(cors({
    origin: `${process.env.FRONTEND_API_URL}`,
    credentials: true,
    optionsSuccessStatus: 201
}));



const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'images',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const uploadprofile = multer({ storage: storage });


app.post("/apis/register", uploadprofile.single('image'), userController.register);

app.post('/apis/login', userController.login);

app.get("/apis/api/restaurants", userController.restaurantsApiGet);
app.get("/apis/api/HomeRestaurant", userController.HomeRestaurant);
app.get("/apis/api/searchdishes", userController.searchdishesGet);
app.get("/apis/api/restaurantMenuPage", userController.restaurantsApiMenuGetPage);
app.get("/apis/api/restaurantMenu/:restaurantId", userController.restaurantsApiMenuGet);
app.put('/apis/api/updateRestaurant/:RestaurantId', uploadprofile.single('RestaurantImgage'), userController.restaurantsApiMenuPUT);
app.post("/apis/api/restaurants", auth.isLogin, uploadprofile.single('RestaurantImgage'), userController.restaurantsApi);
app.post("/apis/api/restaurants/Menu", auth.isLogin, uploadprofile.single('ItemImage'), userController.restaurantsApiMenu);

app.put("/apis/api/updateMenu/:MenuId", auth.isLogin, uploadprofile.single('ItemImage'), userController.restaurantsApiMenuUpDate);
app.put("/apis/api/updateDeal/:MenuId", auth.isLogin, uploadprofile.single('ItemImage'), userController.restaurantsApiupdateDeal);

app.post("/apis/api/restaurants/Deal", auth.isLogin, uploadprofile.single('ItemImage'), userController.restaurantsApiDeal);
app.get("/apis/user-profile", auth.isLogin, userController.userProfile);
app.get("/apis/Cart", auth.isLogin, userController.Cart);
app.get("/apis/CartCoupens", auth.isLogin, userController.CartCoupens);
app.get("/apis/Cart/orders/in-progress", auth.isLogin, userController.ordersInProgress);
app.post("/apis/deliveryboy/sent-AcceptRequest", userController.Deliveryboy_sent_AcceptRequest);

app.post("/apis/delivery-boy", uploadprofile.fields([{ name: 'frontImage' }, { name: 'rearImage' }]), userController.BecomedeliveryBoy);

app.get("/apis/Get-delivery-Notification", auth.isLogin, userController.Get_delivery_Notification);
app.post("/apis/submitRating", userController.submitRating);
app.get("/apis/api/comments", userController.ApiComments);
app.get("/apis/api/comments/grouped-count", userController.ApiCommentsGroupedCount);

app.get("/apis/api/user/liked-menus", auth.isLogin, userController.ApiUserlikedMenus);
app.get("/apis/api/menus/likes-count", userController.ApiMenuslikesCount);

app.get("/apis/Profile", auth.isLogin, userController.Profile);

app.post("/apis/update-user-profile-image", uploadprofile.single('image'), userController.updateUserProfileImage);
app.post("/apis/update-user-profile", uploadprofile.single('image'), userController.updateProfileNames);
app.post("/apis/update-Other-users-profile", uploadprofile.single('image'), userController.updateProfileOtherUsers);

const upload = multer();
app.post("/apis/Delete-Other-users-profile", upload.none(), userController.DeleteProfileOtherUsers);

app.get("/apis/logOut", userController.logOut);

const nodemailer = require("nodemailer");

app.get("/apis/keys", async (req, res) => {
    try {
        KEYS={
            FRONTEND_OPENCAGEDATA_GOOGLE_MAP_KEY:process.env.FRONTEND_OPENCAGEDATA_GOOGLE_MAP_KEY,
            FRONTEND_GOOGLE_MAP_KEY:process.env.FRONTEND_GOOGLE_MAP_KEY,
        }
        res.json({ KEYS:KEYS });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = app;