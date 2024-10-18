require('dotenv').config();
// ==============Models require======**
const Register = require("../src/model/user");
const { RestaurantModel } = require('../src/model/Restaurant');
const userOrders = require('../src/model/userOrders');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const cookie = require('cookie');
const { Counter } = require('../src/model/Restaurant');
const { getIo } = require('./socket');



const register = async (req, res) => {
  try {

    const { email, firstname, lastname, phone, password, confirmpassword, address, language } = req.body;
    const image = req.file;
    if (!email || !firstname || !password || !confirmpassword) {
      return res.status(400).json({ alertMsg: "Please fill in all required fields." });
    }
    if (password !== confirmpassword) {
      return res.status(401).json({ alertMsg: "Passwords do not match." });
    }
    const existingUser = await Register.findOne({
      $or: [
        { email: { $regex: new RegExp(`^${email}$`, 'i') } },
        { firstname: { $regex: new RegExp(`^${firstname}$`, 'i') } }
      ]
    });
    if (existingUser) {
      const existingField = existingUser.email === email ? "Email" : "Firstname";
      return res.status(500).json({ alertMsg: `${existingField} already exists. Please choose a different one.` });
    };
    const registerEmployee = new Register({
      firstname: firstname,
      lastname: lastname,
      email: email,
      phone: phone,
      password: password,
      confirmpassword: confirmpassword,
      image: image ? `${image.filename}` : '',
      language: language,
      address: address,
    })
    const registered = await registerEmployee.save();

    return res.status(201).json({ alertMsg: "successful registration" });

  } catch (error) {
    res.status(404).json({ alertMsg: `data not inserted!` });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password || email === "" || password === "") {
    return res.status(201).json({ errorMsg: "All field are required" });
  }

  try {
    const User = await Register.findOne({ email });
    if (!User) {
      return res.status(201).json({ errorMsg: "User Not Found" });
    }
    const validPassword = await bcrypt.compare(password, User.password);
    if (!validPassword) {
      return res.status(201).json({ errorMsg: "Invalid Password" });
    }
    const token = jwt.sign(
      { id: User._id },
      process.env.SECRET_KEY
    );

    const { password: pass, ...rest } = User._doc;

    const expirationDate = new Date(Date.now() + 60000000);

    res
      .status(201)
      .cookie("access_token", token, {
        secure: true,
        httpOnly: true,
        sameSite: 'None',
        expires: expirationDate
      })
      .json({ rest, errorMsg: "Go To Profile Page" });
  } catch (error) {
    return res.status(201).json({ errorMsg: "error to send login details" });
  }
};

const restaurantsApi = async (req, res) => {
  try {
    const { RestaurantEmailId, RestaurantName, RestaurantPhone, area, district, pincode, state, lat, lng, OpningTime, ClosingTime } = req.body;
    const RestaurantImgage = req.file;

    if (req.user.id) {
      const user = await Register.findById(req.user.id);
      await Register.updateOne(
        { _id: req.user.id },
        { $set: { restaurant: '1' } }
      );

      if (!RestaurantEmailId || !RestaurantName || !RestaurantPhone || !area || !district || !pincode || !state || !lat || !lng) {
        return res.status(400).json({ alertMsg: "*Please fill in all required fields." });
      }
      // const RestaurantPhoneNumber = parseInt(RestaurantPhone)
      const existingRes_Data = await RestaurantModel.findOne({
        $or: [
          { RestaurantEmailId: { $regex: new RegExp(`^${RestaurantEmailId}$`, 'i') } },
          { RestaurantPhone: parseInt(RestaurantPhone) }
        ]
      });

      if (existingRes_Data) {
        const existingField = existingRes_Data.RestaurantEmailId === RestaurantEmailId ? "*Restaurant's Email" : "*Restaurant's Phone Number";
        return res.status(500).json({ alertMsg: `${existingField} already exists. Please choose a different one.` });
      };
      const RestaurantLocation = [{
        area: area,
        district: district,
        lat: lat,
        lng: lng,
        pincode: pincode,
        state: state
      }];
      const Availabitity = [{
        OpningTime: OpningTime,
        ClosingTime: ClosingTime
      }];
      const Ratings = [{
        Rating: 0,
        RatingCount: 0
      }]
      const RestaurantMenu = [{
        // MenuId: 110000,
        ItemName: "ItemName",
        Price: 'Price',
        discount: 'discount',
        description: 'description',
        image: 'image',
        IsVeg: 'true',
        InStock: 'InStock',
        Ratings: Ratings
      }];
      const DealsByRestaurant = [{
        // MenuId: 110000,
        ItemName: "ItemName",
        Price: 'Price',
        discount: 'discount',
        description: 'description',
        image: 'image',
        IsVeg: 'true'
      }];
      const RestaurantData = new RestaurantModel({
        sender_id: user._id,
        RestaurantEmailId: RestaurantEmailId,
        RestaurantName: RestaurantName,
        RestaurantImgage: RestaurantImgage ? `${RestaurantImgage.filename}` : '',
        RestaurantPhone: RestaurantPhone,
        RestaurantLocation: RestaurantLocation,
        Availabitity: Availabitity,

        Ratings: Ratings,
        RestaurantMenu: RestaurantMenu,
        DealsByRestaurant: DealsByRestaurant,
      })
      await RestaurantData.save();

      return res.status(201).json({ alertMsg: "successfully registration" });
    }
    else {
      return res.status(404).json({ alertMsg: 'User not found please login First' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ alertMsg: 'Server error' });
  }
};

const restaurantsApiMenu = async (req, res) => {
  try {
    const { RestaurantId, ItemName, Price, discount, description, IsVeg } = req.body; // Assuming RestaurantId is passed to identify the restaurant
    const ItemImage = req.file;

    if (req.user.id) {
      const user = await Register.findById(req.user.id);

      if (!RestaurantId || !ItemName || !Price || !discount || !description || !IsVeg) {
        return res.status(400).json({ alertMsg: "*Please fill in all required fields." });
      }

      // Find the restaurant by its RestaurantId
      const restaurant = await RestaurantModel.findOne({ RestaurantId: parseInt(RestaurantId) });

      if (!restaurant) {
        return res.status(404).json({ alertMsg: "Restaurant not found." });
      }
      const extractedId = restaurant.sender_id.toString().replace('ObjectId("', '').replace('")', '');
      const restaurant_sender_id = await RestaurantModel.findOne({ sender_id: req.user.id });
      if (extractedId !== req.user.id || restaurant_sender_id.RestaurantId !== parseInt(RestaurantId)) {
        return res.status(404).json({ alertMsg: "Your Restaurant ID is incorrect. Please enter the correct Restaurant ID." });
      }

      // Create the new menu item
      const newMenuItem = {
        ItemName: ItemName,
        Price: Price,
        discount: discount,
        description: description,
        image: ItemImage ? `${ItemImage.filename}` : '',
        IsVeg: true,
        InStock: true, // Set default value for InStock
        Ratings: [{
          Rating: 0,
          RatingCount: 0
        }]
      };

      // Push the new menu item into the RestaurantMenu array
      restaurant.RestaurantMenu.push(newMenuItem);

      // Save the updated restaurant document
      await restaurant.save();

      return res.status(201).json({ alertMsg: "Menu item successfully added." });
    } else {
      return res.status(404).json({ alertMsg: 'User not found please login First' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ alertMsg: 'Server error' });
  }
};

const restaurantsApiDeal = async (req, res) => {
  try {
    if (req.user.id) {
      const { RestaurantId, ItemName, Price, discount, description, IsVeg } = req.body;
      const ItemImage = req.file;
      const user = await Register.findById(req.user.id);

      if (!RestaurantId || !ItemName || !Price || !discount || !description || !IsVeg) {
        return res.status(400).json({ alertMsg: "*Please fill in all required fields." });
      }

      const restaurant = await RestaurantModel.findOne({ RestaurantId: parseInt(RestaurantId) });
      const restaurant_sender_id = await RestaurantModel.findOne({ sender_id: req.user.id });

      if (!restaurant) {
        return res.status(404).json({ alertMsg: "Restaurant not found." });
      }
      const extractedId = restaurant.sender_id.toString().replace('ObjectId("', '').replace('")', '');
      if (extractedId !== req.user.id || restaurant_sender_id.RestaurantId !== parseInt(RestaurantId)) {
        return res.status(404).json({ alertMsg: "Your Restaurant ID is incorrect. Please enter the correct Restaurant ID." });
      }

      // Create the new menu item
      const newDealItem = {
        ItemName: ItemName,
        Price: Price,
        discount: discount,
        description: description,
        image: ItemImage ? `${ItemImage.filename}` : '',
        IsVeg: true,
        InStock: true, // Set default value for InStock
        Ratings: [{
          Rating: 0,
          RatingCount: 0
        }]
      };

      // Push the new menu item into the RestaurantMenu array
      restaurant.DealsByRestaurant.push(newDealItem);

      // Save the updated restaurant document
      await restaurant.save();

      return res.status(201).json({ alertMsg: "DealsByRestaurant item successfully added." });
    } else {
      return res.status(404).json({ alertMsg: 'User not found please login First' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ alertMsg: 'Server error' });
  }
};

const restaurantsApiGet = async (req, res) => {
  const { page = 1, pageSize = 3, q } = req.query;
  const skip = (page - 1) * pageSize;
  // console.log("page",page,skip);


  // Building the match criteria
  const matchStage = {
    $or: [
      { 'RestaurantName': { $regex: q, $options: 'i' } },
      { 'RestaurantMenu.ItemName': { $regex: q, $options: 'i' } },
    ]
  };

  // Aggregation pipeline
  const pipeline = [
    { $match: matchStage },
    {
      $project: {
        RestaurantName: 1,
        'RestaurantLocation.area': 1,
        'RestaurantLocation.district': 1,
        'RestaurantLocation.state': 1,
        'RestaurantMenu.ItemName': 1,
        'RestaurantMenu.image': 1,
        'RestaurantMenu.description': 1,
        'DealsByRestaurant.description': 1,
        'RestaurantImgage': 1,
        'RestaurantId': 1,
        'RestaurantMenu.MenuId': 1
      }
    },
    { $skip: parseInt(skip) },
    { $limit: parseInt(pageSize) }
  ];

  const pipelinecount = [
    { $match: matchStage },
    { $count: 'total' }
  ];

  try {
    const restaurants = await RestaurantModel.aggregate(pipeline);
    const totalCount = await RestaurantModel.aggregate(pipelinecount);

    res.json({
      restaurants: restaurants,
      totalResults: totalCount[0] ? totalCount[0].total : 0,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

const restaurantsApiMenuGet = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const restaurantData = await RestaurantModel.findOne({ RestaurantId: restaurantId });


    if (!restaurantData) {
      return res.status(404).json({ alertMsg: 'Restaurant not found' });
    }
    res.json(restaurantData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const restaurantsApiMenuGetPage = async (req, res) => {
  const { page = 1, pageSize = 2, restaurantId } = req.query;

  const skip = (page - 1) * pageSize;

  try {
    const restaurant = await RestaurantModel.findOne({ RestaurantId: parseInt(restaurantId) });
    const extractedId = restaurant.sender_id.toString().replace('ObjectId("', '').replace('")', '');

    if (!restaurant) {
      return res.status(404).json({ alertMsg: 'Restaurant not found' });
    }

    // Paginate the RestaurantMenu array
    const totalMenus = restaurant.RestaurantMenu.length;
    const paginatedMenus = restaurant.RestaurantMenu.slice(skip, skip + parseInt(pageSize));

    res.json({
      restaurantSender_id: extractedId,
      restaurants: paginatedMenus,
      totalResults: parseInt(totalMenus)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const restaurantsApiMenuPUT = async (req, res) => {
  const { RestaurantId } = req.params;
  try {
    const { RestaurantEmailId, RestaurantName, RestaurantPhone, area, district, pincode, state, lat, lng, OpningTime, ClosingTime } = req.body;
    const RestaurantImgage = req.file;
    const restaurantData = await RestaurantModel.findOne({ RestaurantId: RestaurantId });
    const id = restaurantData._id

    const existingRes_Data = await RestaurantModel.findOne({
      $or: [
        { RestaurantEmailId: { $regex: new RegExp(`^${RestaurantEmailId}$`, 'i') } },
        { RestaurantPhone: parseInt(RestaurantPhone) }
      ],
      _id: { $ne: id }
    });

    if (existingRes_Data) {
      const existingField = existingRes_Data.RestaurantEmailId === RestaurantEmailId ? "*Restaurant's Email" : "*Restaurant's Phone Number";
      return res.status(500).json({ alertMsg: `${existingField} already exists. Please choose a different one.` });
    };
    const RestaurantLocation = [{
      area: area,
      district: district,
      lat: lat,
      lng: lng,
      pincode: pincode,
      state: state
    }];
    const Availabitity = [{
      OpningTime: OpningTime,
      ClosingTime: ClosingTime
    }];
    const updateRest = {
      RestaurantEmailId: RestaurantEmailId,
      RestaurantName: RestaurantName,
      RestaurantImgage: RestaurantImgage ? `${RestaurantImgage.filename}` : '',
      RestaurantPhone: RestaurantPhone,
      RestaurantLocation: RestaurantLocation,
      Availabitity: Availabitity
    }

    const updatedRestaurant = await RestaurantModel.findByIdAndUpdate(id, updateRest, { new: true });
    if (!updatedRestaurant) {
      return res.status(404).json({ alertMsg: 'Restaurant not found' });
    }
    res.status(200).json({ alertMsg: 'Restaurant updated successfully!', restaurantData: updatedRestaurant });
  } catch (error) {
    console.error(error);
    res.status(500).json({ alertMsg: 'Failed to update restaurant', error: error.message });
  }
};

const restaurantsApiMenuUpDate = async (req, res) => {
  const { MenuId } = req.params; // MenuId from request params
  const { RestaurantId, ItemName, Price, discount, description, IsVeg, InStock } = req.body;
  const ItemImage = req.file;

  try {
    // Check for required fields
    if (!RestaurantId || !ItemName || !Price || !discount || !description || !IsVeg || !InStock) {
      return res.status(400).json({ alertMsg: "*Please fill in all required fields." });
    }

    const restaurant = await RestaurantModel.findOne({ RestaurantId: parseInt(RestaurantId) });
    const restaurant_sender_id = await RestaurantModel.findOne({ sender_id: req.user.id });

    if (!restaurant) {
      return res.status(404).json({ alertMsg: "Restaurant not found." });
    }
    const extractedId = restaurant.sender_id.toString().replace('ObjectId("', '').replace('")', '');
    if (extractedId !== req.user.id || restaurant_sender_id.RestaurantId !== parseInt(RestaurantId)) {
      return res.status(404).json({ alertMsg: "Your Restaurant ID is incorrect. Please enter the correct Restaurant ID." });
    }

    // Prepare the update fields
    const updateFields = {
      'RestaurantMenu.$.ItemName': ItemName,
      'RestaurantMenu.$.Price': Price,
      'RestaurantMenu.$.discount': discount,
      'RestaurantMenu.$.description': description,
      'RestaurantMenu.$.IsVeg': IsVeg,
      'RestaurantMenu.$.InStock': InStock,
    };
    if (ItemImage) {
      updateFields['RestaurantMenu.$.image'] = `${ItemImage.filename}`;
    }

    // Perform the update
    const result = await RestaurantModel.updateOne(
      { RestaurantId: RestaurantId, 'RestaurantMenu.MenuId': parseInt(MenuId) },
      { $set: updateFields }
    );

    if (result.nModified === 0) {
      return res.status(404).json({ alertMsg: 'Menu item not found or no changes made' });
    }

    res.status(200).json({ alertMsg: 'Menu item updated successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ alertMsg: 'Failed to update menu item', error: error.message });
  }
};

const restaurantsApiupdateDeal = async (req, res) => {
  const { MenuId } = req.params; // MenuId from request params
  const { RestaurantId, ItemName, Price, discount, description, IsVeg } = req.body;
  const ItemImage = req.file;

  try {
    // Check for required fields
    if (!RestaurantId || !ItemName || !Price || !discount || !description || !IsVeg) {
      return res.status(400).json({ alertMsg: "*Please fill in all required fields." });
    }
    const restaurant = await RestaurantModel.findOne({ RestaurantId: parseInt(RestaurantId) });
    const restaurant_sender_id = await RestaurantModel.findOne({ sender_id: req.user.id });

    if (!restaurant) {
      return res.status(404).json({ alertMsg: "Restaurant not found." });
    }
    const extractedId = restaurant.sender_id.toString().replace('ObjectId("', '').replace('")', '');
    if (extractedId !== req.user.id || restaurant_sender_id.RestaurantId !== parseInt(RestaurantId)) {
      return res.status(404).json({ alertMsg: "Your Restaurant ID is incorrect. Please enter the correct Restaurant ID." });
    }

    // Prepare the update fields
    const updateFields = {
      'DealsByRestaurant.$.ItemName': ItemName,
      'DealsByRestaurant.$.Price': Price,
      'DealsByRestaurant.$.discount': discount,
      'DealsByRestaurant.$.description': description,
      'DealsByRestaurant.$.IsVeg': IsVeg,
    };

    if (ItemImage) {
      updateFields['DealsByRestaurant.$.image'] = `${ItemImage.filename}`;
    }

    // Perform the update
    const result = await RestaurantModel.updateOne(
      { RestaurantId: RestaurantId, 'DealsByRestaurant.MenuId': parseInt(MenuId) },
      { $set: updateFields }
    );

    if (result.nModified === 0) {
      return res.status(404).json({ alertMsg: 'Menu item not found or no changes made' });
    }

    res.status(200).json({ alertMsg: 'Menu item updated successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ alertMsg: 'Failed to update menu item', error: error.message });
  }
};

const searchdishesGet = async (req, res) => {
  const { pageMenu = 1, pageSize = 2, q, restaurantId } = req.query;
  const skip = (pageMenu - 1) * pageSize;
  // console.log(pageMenu,q);
  const restaurant = await RestaurantModel.findOne({ RestaurantId: parseInt(restaurantId) });
  const extractedId = restaurant.sender_id.toString().replace('ObjectId("', '').replace('")', '');


  // Building the match criteria for the RestaurantMenu
  const matchStage = {
    'RestaurantMenu.ItemName': { $regex: q, $options: 'i' },
    'RestaurantId': parseInt(restaurantId),
  };

  // Aggregation pipeline
  const pipeline = [
    { $unwind: '$RestaurantMenu' },  // Unwind the RestaurantMenu array
    { $match: matchStage },  // Match the criteria for the menu items
    {
      $project: {
        _id: 0,  // Exclude the restaurant ID
        ItemName: '$RestaurantMenu.ItemName',
        image: '$RestaurantMenu.image',
        description: '$RestaurantMenu.description',
        discount: '$RestaurantMenu.discount',
        MenuId: '$RestaurantMenu.MenuId',
        Ratings: '$RestaurantMenu.Ratings',
        IsVeg: '$RestaurantMenu.IsVeg',
        InStock: '$RestaurantMenu.InStock',
        Price: '$RestaurantMenu.Price'
      }
    },
    { $skip: parseInt(skip) },
    { $limit: parseInt(pageSize) }
  ];

  const pipelineCount = [
    { $unwind: '$RestaurantMenu' },
    { $match: matchStage },
    { $count: 'total' }
  ];

  try {
    const menuItems = await RestaurantModel.aggregate(pipeline);
    const totalCount = await RestaurantModel.aggregate(pipelineCount);

    const totalResults = totalCount.length > 0 ? totalCount[0].total : 0;

    res.json({
      restaurantSender_id: extractedId,
      menuItems: menuItems,
      totalResults: totalResults,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};


const Get_delivery_Notification = async (req, res) => {
  const { page = 1 } = req.query;
  const limit = 3;
  try {
    if (req.user) {
      // Retrieve user information to get the email
      const user = await Register.findById(req.user.id);

      const userEmail = user.email;

      // Aggregate query to find matching orders across all userOrders documents
      const userOrdersData = await userOrders.aggregate([
        { $unwind: "$orders" }, // Unwind the orders array
        {
          $match: {
            "orders.deliveryBoysEmails.email": userEmail // Filter orders where deliveryBoysEmails contains the user's email
          }
        },
        {
          $project: {
            _id: 0,
            order: "$orders",
            parentEmail: "$email" // Include parent email
          }
        }
      ]);

      if (userOrdersData.length > 0) {
        // Extract all unique delivery boys' emails
        const allDeliveryBoyEmails = userOrdersData.flatMap(orderData =>
          orderData.order.deliveryBoysEmails.map(emailObj => emailObj.email)
        );
        const uniqueDeliveryBoyEmails = [...new Set(allDeliveryBoyEmails)];

        // Fetch details for all delivery boys in parallel
        const deliveryBoyDetails = await Register.find({ email: { $in: uniqueDeliveryBoyEmails } });

        // Create a map of email to details for quick lookup
        const deliveryBoyDetailsMap = deliveryBoyDetails.reduce((acc, details) => {
          acc[details.email] = {
            firstname: details.firstname,
            lastname: details.lastname,
            phone: details.phone,
            image: details.image,
            deliveryBoy: details.deliveryBoy[details.deliveryBoy.length - 1],
          };
          return acc;
        }, {});

        // Update each order's deliveryBoysEmails array with the fetched details
        await Promise.all(userOrdersData.map(async (orderData) => {
          // Update delivery boys' details at the specific index
          orderData.order.deliveryBoysEmails.forEach(emailObj => {
            const details = deliveryBoyDetailsMap[emailObj.email];
            if (details) {
              emailObj.firstname = details.firstname;
              emailObj.lastname = details.lastname;
              emailObj.phone = details.phone;
              emailObj.image = details.image;
              emailObj.deliveryBoy = details.deliveryBoy;
            }
          });

          // Fetch parent user details
          const parentUser = await Register.findOne({ email: orderData.parentEmail });
          const restaurant = await RestaurantModel.findOne({ RestaurantId: parseInt(orderData.order.RestaurantId) });

          if (parentUser) {
            orderData.parentUserDetails = {
              firstname: parentUser.firstname,
              lastname: parentUser.lastname,
              phone: parentUser.phone,
              image: parentUser.image,
              email: parentUser.email,
              restaurantAddress: restaurant.RestaurantLocation[0]
            };
            delete orderData.parentEmail; // Remove the parentEmail field if not needed
          }
        }));

        const startIndex = parseInt((page - 1) * limit);
        const NotificationData = userOrdersData.slice(startIndex, startIndex + limit);

        // Return the matching orders with updated delivery boy details and parent user details
        res.status(200).json({ user: userEmail, userData: user, NotificationData: NotificationData, TotalLength: userOrdersData.length });
      } else {
        res.status(200).json({ user: userEmail, userData: user, NotificationData: [], message: 'No matching orders found for this user' });
      }
    } else {
      res.status(401).json({ message: 'Unauthorized' });
    }
  } catch (error) {
    console.error('Error retrieving delivery notifications:', error);
    res.status(500).json({ message: 'Failed to retrieve delivery notifications' });
  }
};


const setupSocketIoListeners = (io) => {
  io.on('connection', (socket) => {
    // console.log('New client connected');
    socket.on('markAsRead', async ({ orderId, email }) => {
      try {
        // Update the seen status of the notification
        const result = await userOrders.updateOne(
          { 'orders.id': orderId, 'orders.deliveryBoysEmails.email': email },
          { $set: { 'orders.$[order].deliveryBoysEmails.$[email].seen': true } },
          {
            arrayFilters: [
              { 'order.id': orderId },
              { 'email.email': email }
            ]
          }
        );


        if (result.modifiedCount > 0) {
          console.log(`Order ${orderId} marked as read`);
        } else {
          console.log(`No matching ${orderId} order`)
        }
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    });

    socket.on('registerDeliveryBoy', async ({ payload }) => {
      try {
        const user = await Register.findOne({ email: payload.email });
        const orders = payload.orders;
        const orderDetails = orders[0];
        const restaurant = await RestaurantModel.findOne({ RestaurantId: orderDetails.RestaurantId });
        const order = {
          email: user.email,
          userName: `${user.firstname} ${user.lastname}`,
          userPhone: user.phone,
          RestaurantId: restaurant.RestaurantId,
          RestaurantName: restaurant.RestaurantName,
          RestaurantImgSrc: restaurant.RestaurantImgage,
          restaurantAddress: restaurant.RestaurantLocation[0],
          DeliveryAddress: orderDetails.DeliveryAddress,
          amount: orderDetails.amount,
          selectedPaymentMethod: orderDetails.selectedPaymentMethod,
          deliveryTime: '',
          items: orderDetails.items,
        };
        // console.log(order.DeliveryAddress.area);

        // Find delivery boys assigned to the restaurant with matching addresses
        const deliveryBoys = await Register.find({
          'deliveryBoy.admin': '1',
          $or: [
            { 'deliveryBoy.currentLocation': { $regex: order.DeliveryAddress.area, $options: 'i' } },
            { 'deliveryBoy.currentLocation': { $regex: order.DeliveryAddress.district, $options: 'i' } },
            { 'deliveryBoy.currentLocation': { $regex: order.DeliveryAddress.pincode, $options: 'i' } },
            { 'deliveryBoy.currentLocation': { $regex: order.restaurantAddress.area, $options: 'i' } },
            { 'deliveryBoy.currentLocation': { $regex: order.restaurantAddress.district, $options: 'i' } },
            { 'deliveryBoy.currentLocation': { $regex: order.restaurantAddress.pincode, $options: 'i' } },
          ]
        });


        if (deliveryBoys.length === 0) {
          console.log('No delivery boys found for the given address area.');
          return;
        }
        // Extract email addresses of the delivery boys
        const _id = restaurant.sender_id;
        const RestaurantOwner = await Register.findById(_id).select('firstname lastname email');

        const deliveryBoyEmailStatuses = deliveryBoys.map(deliveryBoy => ({
          email: deliveryBoy.email,
          Accept: '',
          Reject: '',
          isRestaurant: false,
          seen: false,
        }));
        const restaurantDetails = {
          email: RestaurantOwner ? RestaurantOwner.email : '',
          Accept: '',
          Reject: '',
          isRestaurant: true,
          seen: false
        }
        deliveryBoyEmailStatuses.push(restaurantDetails);

        // Find the userOrder document
        let userOrder = await userOrders.findOne({ email: order.email });
        const counterOld = await Counter.findOne({ name: 'order' });
        const counter = parseInt(counterOld?.seq + 1)
        // Create a notification
        const notification = {
          orderDetails: {
            userName: order.userName,
            userPhone: order.userPhone,
            restaurantAddress: order.restaurantAddress,
            restaurantName: order.RestaurantName,
            restaurantId: order.RestaurantId,
            restaurantUserEmail: RestaurantOwner?.email,
            restaurantImage: order.RestaurantImgSrc,
            DeliveryAddress: order.DeliveryAddress,
            selectedPaymentMethod: order.selectedPaymentMethod,
            items: order.items,
            orderId: counter,
            deliveryBoys: deliveryBoys,
          },
          message: `New order from ${order.userName}`,
          seen: false,
        };

        io.emit('newNotification', notification);

        // Add the new order to the user's orders array with delivery boy emails
        if (userOrder) {
          userOrder.orders.push({
            ...order,
            deliveryBoysEmails: deliveryBoyEmailStatuses, // Save the email list with the order
          });
        } else {
          userOrder = new userOrders({
            email: order.email, // Use order.email instead of the undefined email variable
            orders: [
              {
                ...order,
                deliveryBoysEmails: deliveryBoyEmailStatuses,
              },
            ],
          });
        }

        // Save the updated userOrder document
        await userOrder.save();
      } catch (error) {
        console.error('Error sending notifications:', error);
      }
    });

    socket.on('sendNotificationToRestaurant', async (order) => {
      if (order) {
        // -----
        const email = order.email;
        let DeliveryBoy = await Register.findOne({ email });
        const orderData = await userOrders.findOne(
          { 'orders.id': order.orderId },
          { orders: { $elemMatch: { id: order.orderId } } }
        );
        if (orderData && orderData.orders && orderData.orders[0]) {
          const RestaurantId = parseInt(orderData.orders[0].RestaurantId);
          const RestaurantData = await RestaurantModel.findOne({ RestaurantId });
          const restaurantUserEmail = await Register.findById(RestaurantData.sender_id)


          // Create a notification
          const notification = {
            orderDetails: {
              firstname: DeliveryBoy.firstname,
              lastname: DeliveryBoy.lastname,
              phone: DeliveryBoy.phone,
              image: DeliveryBoy.image,
              deliveryBoy: DeliveryBoy.deliveryBoy[DeliveryBoy.deliveryBoy.length - 1],
              orderId: order.orderId,
              restaurantUserEmail: restaurantUserEmail.email
            },
            message: `New DeliveryBoy ${DeliveryBoy.firstname} ${DeliveryBoy.lastname}`
          };

          io.emit('receiveNotificationToRestaurant', notification);
        }
        // -----
      }
    });

    socket.on('RestaurantAcceptDeliveryBoyOrNot', async ({ deliveryBoy, orderId }) => {
      try {
        const email = deliveryBoy.email;
        // const deliveryBoyDataDatails = await Register.findOne({ email });

        const currentTime = new Date();
        const updatedOrder = await userOrders.findOneAndUpdate(
          { 'orders.id': orderId, 'orders.deliveryBoysEmails.email': email },
          {
            $set: {
              'orders.$[order].deliveryBoysEmails.$[email].RestaurantAcceptOrReject': 'RestaurantAccept',
              'orders.$[order].deliveryBoysEmails.$[email].RestaurantAcceptOrRejectTime': currentTime,
              // 'orders.$[order].deliveryBoysEmails.$[email].deliveryBoydetails': deliveryBoyDataDatails,
            }
          }, {
          arrayFilters: [{ 'order.id': orderId }, { 'email.email': email }],
          new: true
        }
        );

        if (!updatedOrder) {
          return res.status(404).json({ error: 'Order not found' });
        }
        const orderIdsData = await userOrders.findOne(
          { 'orders.id': orderId },
          { orders: { $elemMatch: { id: orderId } } }
        );

        const updatedDeliveryBoy = {
          ...deliveryBoy,
          RestaurantAcceptOrReject: "RestaurantAccept",
          RestaurantAcceptOrRejectTime: currentTime,
        };
        const deliveryBoyData = {
          deliveryBoy: updatedDeliveryBoy,
          orderIdsData,
          orderId
        };

        io.emit('SentToDeliveryBoyAndUser', deliveryBoyData);

      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    });

    socket.on('ordersUpdateStatus', async ({ orderId, orderStatus, email, deliveryBoy_Email }) => {
      try {
        const currentTime = new Date();

        const user = await userOrders.findOneAndUpdate(
          { email, 'orders.id': orderId },
          { $set: { 'orders.$.statusSteps_id': orderStatus } },
          { new: true }
        );
        if (orderStatus == 6) {

          const register = await Register.findOne({ email: deliveryBoy_Email });
          const DeliveriesCompleted = register.deliveryBoy[0].DeliveriesCompleted || 0;
          register.deliveryBoy[0].DeliveriesCompleted = parseInt(DeliveriesCompleted) + 1;
          await register.save();

          await userOrders.findOneAndUpdate(
            { email, 'orders.id': orderId },
            {
              $set: {
                'orders.$.status': 'Delivered',
                'orders.$.deliveryTime': currentTime,
              }
            },
            { new: true }
          );
        }

        if (!user) {
          return res.status(404).json({ error: 'Order not found' });
        }
        const OrderData = { orderId, orderStatus, email, currentTime }

        io.emit('SentordersUpdatedStatus', OrderData);

      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    });

    socket.on('StoreTheLikes', async ({ email, menuId, action }) => {
      try {
        // Check if email and menuId are provided
        if (!email || !menuId) {
          socket.emit('likeResponse', {
            success: false,
            error: 'Please log in first to like the menu item.',
            menuId,
          });
          return;
        }

        // Find the restaurant containing the menu item by MenuId
        const restaurant = await RestaurantModel.findOne({
          'RestaurantMenu.MenuId': menuId,
        });

        if (!restaurant) {
          socket.emit('likeResponse', {
            success: false,
            error: 'Menu item not found.',
            menuId,
          });
          return;
        }

        // Find the menu item within the restaurant
        const menu = restaurant.RestaurantMenu.find((menu) => menu.MenuId === menuId);

        // Determine the action: like or dislike
        if (action === 'like') {
          // Check if the like already exists
          const existingLike = menu.Likes.some((like) => like.email === email);

          if (existingLike) {
            socket.emit('likeResponse', {
              success: false,
              error: 'You have already liked this menu item.',
              menuId,
            });
            return;
          }

          // Add the email to the Likes array of the menu item
          menu.Likes.push({ email });

          // Save the updated restaurant document
          await restaurant.save();

          // Emit success response with action 'like'
          socket.emit('likeResponse', {
            success: true,
            menuId,
            action: 'like',
          });
        } else if (action === 'dislike') {
          // Find the like entry to remove
          const likeIndex = menu.Likes.findIndex((like) => like.email === email);

          if (likeIndex === -1) {
            socket.emit('likeResponse', {
              success: false,
              error: 'You have not liked this menu item yet.',
              menuId,
            });
            return;
          }

          // Remove the like entry from the Likes array
          menu.Likes.splice(likeIndex, 1);

          // Save the updated restaurant document
          await restaurant.save();

          // Emit success response with action 'dislike'
          socket.emit('likeResponse', {
            success: true,
            menuId,
            action: 'dislike',
          });
        }
      } catch (error) {
        console.error('Error processing like/dislike:', error);
        socket.emit('likeResponse', {
          success: false,
          error: 'An error occurred while processing your request.',
          menuId,
        });
      }
    });



    // Remove the delivery boy from the map upon disconnection
    socket.on('disconnect', () => {
      // console.log(`Delivery boy disconnected: ${email}`);
    });

  });
};



const BecomedeliveryBoy = async (req, res) => {
  try {
    const { email, updateProfile, dutyStartTime, dutyEndTime, vehicleNumber, currentLocation, currentStatus } = req.body;
    const frontImage = req.files['frontImage']?.[0]?.filename || '';
    const rearImage = req.files['rearImage']?.[0]?.filename || '';

    const delivery = {
      admin: '1',
      frontImage: frontImage,
      rearImage: rearImage,
      dutyStartTime: dutyStartTime,
      dutyEndTime: dutyEndTime,
      vehicleNumber: vehicleNumber,
      currentLocation: currentLocation,
      currentStatus: currentStatus,
      DeliveriesCompleted: 0,
      Ratings: [{
        Rating: 0,
        RatingCount: 0
      }],
    };

    let DeliveryBoy = await Register.findOne({ email });

    if (DeliveryBoy) {
      if (updateProfile === 'yes') {
        const lastIndex = DeliveryBoy.deliveryBoy.length - 1;
        if (lastIndex >= 0) {
          const currentDelivery = DeliveryBoy.deliveryBoy[lastIndex];

          // Prepare the updated delivery data, only updating non-empty fields
          const updatedDelivery = {
            admin: '1',
            frontImage: frontImage || currentDelivery.frontImage,
            rearImage: rearImage || currentDelivery.rearImage,
            dutyStartTime: dutyStartTime || currentDelivery.dutyStartTime,
            dutyEndTime: dutyEndTime || currentDelivery.dutyEndTime,
            vehicleNumber: vehicleNumber || currentDelivery.vehicleNumber,
            currentLocation: currentLocation || currentDelivery.currentLocation,
            currentStatus: currentStatus || currentDelivery.currentStatus,
            DeliveriesCompleted: currentDelivery.DeliveriesCompleted,
            Ratings: currentDelivery.Ratings
          };

          await Register.updateOne(
            { email, [`deliveryBoy.${lastIndex}`]: { $exists: true } },
            { $set: { [`deliveryBoy.${lastIndex}`]: updatedDelivery } }
          );
        }
      } else {
        DeliveryBoy.deliveryBoy.push(delivery);
        await DeliveryBoy.save();
      }
    }

    res.status(200).json({ message: "Delivery Boy details added/updated successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while adding/updating delivery boy details." });
  }
};

const Cart = async (req, res) => {
  try {
    if (req.user.id) {
      const user = await Register.findById(req.user.id);
      const email = user.email
      var userOrder = await userOrders.findOne({ email });
      const RestaurantMenuForCart = await RestaurantModel.find({});
      res.json({ ordersData: userOrder, RestaurantMenuForCart: RestaurantMenuForCart });
    }
    else {
      return res.status(404).json({ error: 'User not found' });
    }
    // try 
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const HomeRestaurant = async (req, res) => {
  try {
    const RestaurantMenuForCart = await RestaurantModel.find({});
    if (RestaurantMenuForCart) {
      res.json({ RestaurantMenuForCart: RestaurantMenuForCart });
    }
    else {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const CartCoupens = async (req, res) => {
  const { RestaurantId, page = 1 } = req.query;
  const limit = 2;
  try {
    if (req.user.id) {
      const RestaurantMenuForCart = await RestaurantModel.findOne({ RestaurantId });
      const startIndex = parseInt((page - 1) * limit);
      const paginatedComments = RestaurantMenuForCart.DealsByRestaurant.slice(startIndex, startIndex + limit);

      if (RestaurantMenuForCart) {
        res.json({ data: paginatedComments, TotalLength: RestaurantMenuForCart.DealsByRestaurant.length });
      }
      else {
        return res.status(404).json({ alertMsg: 'Restaurant is Not found' });
      }
    }
    else {
      return res.status(404).json({ error: 'User not found' });
    }
    // try 
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const ordersInProgress = async (req, res) => {
  try {
    if (req.user && req.user.id) {
      const user = await Register.findById(req.user.id);
      if (!user) {
        return res.status(201).json({ alertMsg: 'User not found' });
      }

      const email = user.email;
      const userOrder = await userOrders.findOne({ email });

      if (!userOrder || !userOrder.orders.length) {
        return res.status(201).json({ alertMsg: 'No orders found' });
      }
      const inProgressOrders = userOrder.orders.filter(order => order.status === 'In-Progress');

      if (!inProgressOrders.length) {
        return res.status(201).json({ alertMsg: 'No In-Progress orders found' });
      }
      // Iterate through each order
      for (const order of inProgressOrders) {
        order.deliveryBoysEmails = await Promise.all(order.deliveryBoysEmails.map(async (deliveryBoy) => {
          if (deliveryBoy.Accept === "Accept" && deliveryBoy.RestaurantAcceptOrReject === "RestaurantAccept") {
            const deliveryBoyDetails = await Register.findOne({ email: deliveryBoy.email });
            return {
              ...deliveryBoy,
              details: deliveryBoyDetails || ""  // Include details or "no" if not found
            };
          } else {
            return {
              ...deliveryBoy,
              details: ""
            };
          }
        }));
      }

      res.json({ ordersData: inProgressOrders, alertMsg: '' });
    } else {
      return res.status(401).json({ alertMsg: 'Unauthorized user' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ alertMsg: 'Server error' });
  }
};

const submitRating = async (req, res) => {
  try {
    const {
      deliveryBoyRating,
      deliverBoy_Email,
      restaurantRating,
      RestaurantId,
      order_id,
      email,
      comment,
      itemRatings,
    } = req.body;

    // (1) Update Delivery Boy Rating
    if (deliveryBoyRating !== null && deliverBoy_Email !== null) {
      const register = await Register.findOne({
        email: deliverBoy_Email,
      });

      if (register && register.deliveryBoy.length > 0) {
        // Access the first delivery boy in the array
        const deliveryBoy = register.deliveryBoy[0].Ratings[0];
        // Calculate the new average rating
        const currentRating = deliveryBoy.Rating || 0;
        const updatedRating =
          (currentRating * deliveryBoy.RatingCount + deliveryBoyRating) /
          (deliveryBoy.RatingCount + 1);

        // Update the delivery boy rating and rating count
        deliveryBoy.Rating = updatedRating;
        deliveryBoy.RatingCount += 1;

        await register.save();
      }
    }

    // (2) Update Restaurant Rating
    if (restaurantRating !== null && RestaurantId !== null) {
      const restaurant = await RestaurantModel.findOne({ RestaurantId });

      if (restaurant && restaurant.Ratings.length > 0) {
        // Access the first rating in the array
        const currentRating = restaurant.Ratings[0].Rating || 0;
        // Calculate the new average rating
        const updatedRating =
          (currentRating * restaurant.Ratings[0].RatingCount + restaurantRating) /
          (restaurant.Ratings[0].RatingCount + 1);

        // Update the restaurant rating and rating count
        restaurant.Ratings[0].Rating = updatedRating;
        restaurant.Ratings[0].RatingCount += 1;

        await restaurant.save();
      }
    }

    // (3) Update Item Ratings in User Orders
    if (RestaurantId !== null && itemRatings && itemRatings.length > 0 && itemRatings.some((item) => item.item_id !== null && item.rating !== null)) {
      // Find the restaurant using the provided RestaurantId
      const restaurant = await RestaurantModel.findOne({ RestaurantId });

      if (restaurant) {
        // Loop through each item in the provided itemRatings and update its rating
        itemRatings.forEach((item) => {
          const { item_id, rating } = item;

          // Only update if the rating is not null
          if (rating !== null) {
            // Find the specific menu item in the RestaurantMenu array by item_id (MenuId)
            const menuItem = restaurant.RestaurantMenu.find(
              (menu) => menu.MenuId === item_id
            );

            if (menuItem) {
              // Check if Ratings exists; if not, initialize it
              if (!menuItem.Ratings || menuItem.Ratings.length === 0) {
                menuItem.Ratings = [{ Rating: 0, RatingCount: 0 }];
              }

              // Access the first rating in the array
              const currentRating = menuItem.Ratings[0].Rating || 0;
              const currentRatingCount = menuItem.Ratings[0].RatingCount || 0;

              // Calculate the new average rating
              const updatedRating =
                (currentRating * currentRatingCount + rating) /
                (currentRatingCount + 1);

              // Update the item rating and rating count
              menuItem.Ratings[0].Rating = updatedRating;
              menuItem.Ratings[0].RatingCount += 1;
            }
          }
        });
        // Save the restaurant document after modifying the nested array
        await restaurant.save();
        console.log('Ratings updated successfully');
      } else {
        console.error('Restaurant not found for the given restaurantId');
      }
    }

    // (4) Store Order Comment
    if (email !== null && comment !== null && order_id !== null) {
      const userOrder = await userOrders.findOne({ 'orders.id': order_id });
      if (userOrder) {
        const order = userOrder.orders.find((order) => order.id === order_id);
        if (order) {
          // Initialize Comments array if it doesn't exist
          if (!order.Comments) {
            order.Comments = [];
          }
          // Initialize MenuId as an empty array
          const menuIds = [];
          // Check if itemRatings exist and have valid item_id(s)
          if (itemRatings && itemRatings.length > 0) {
            itemRatings.forEach((item) => {
              if (item.item_id) {
                // Push item_id to menuIds array if it exists
                menuIds.push(item.item_id);
              }
            });
          }
          // Add the new comment to the Comments array with MenuId populated
          order.Comments.push({
            email: email,
            Comment: comment,
            MenuId: menuIds, // Push menuIds array into MenuId
          });

          await userOrder.save();
          console.log('Comment added successfully');
        } else {
          console.error('Order not found for the given order_id');
        }
      } else {
        console.error('User order not found');
      }
    }




    res.status(200).json({ alertMsg: 'Order status updated successfully' });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ alertMsg: 'Failed to update order status' });
  }
};


const Deliveryboy_sent_AcceptRequest = async (req, res) => {
  const { orderId, email } = req.body;
  const currentTime = new Date();

  try {
    const user = await userOrders.findOneAndUpdate(
      {
        'orders.id': orderId,
        'orders.deliveryBoysEmails.email': email
      },
      {
        $set: {
          'orders.$[order].deliveryBoysEmails.$[email].Accept': 'Accept',
          'orders.$[order].deliveryBoysEmails.$[email].AcceptedOrRejectedTime': currentTime
        }
      },
      {
        arrayFilters: [
          { 'order.id': orderId },
          { 'email.email': email }
        ],
        new: true
      }
    );

    if (!user) {
      return res.status(404).json({ error: 'Order not found' });
    }
    const order = {
      email: email,
      orderId: orderId
    }
    // await sendNotificationToRestaurant(order);

    res.status(200).json({ alertMsg: 'Order status updated successfully' });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
};


const ApiComments = async (req, res) => {
  const { menuId, page = 1 } = req.query;
  const limit = 3;
  const parsedMenuId = parseInt(menuId);

  try {
    const orders = await userOrders.find({
      'orders.Comments.MenuId': parsedMenuId,
    }).select('orders.Comments orders.email');

    let commentsArray = [];

    // Extract comments from all matching orders
    orders.forEach((order) => {
      order.orders.forEach((o) => {
        o.Comments.forEach((comment) => {
          if (comment.MenuId.includes(parsedMenuId)) {
            commentsArray.push({
              email: comment.email,
              ...comment.toObject(),
            });
          }
        });
      });
    });

    // Get unique emails from the comments to find user details
    const uniqueEmails = [...new Set(commentsArray.map((c) => c.email))];

    // Fetch user details from Register model based on email
    const users = await Register.find({ email: { $in: uniqueEmails } });

    // Merge user details with comments
    const enrichedComments = commentsArray.map((comment) => {
      const user = users.find((u) => u.email === comment.email);
      return {
        firstname: user?.firstname || 'Unknown',
        lastname: user?.lastname || '',
        image: user?.image || '/default-profile.png', // Default image if none found
        Comment: comment.Comment,
        _id: comment._id,
        createdAt: comment.createdAt,
      };
    });

    // Paginate comments by slicing the array
    const startIndex = parseInt((page - 1) * limit);
    const paginatedComments = enrichedComments.slice(startIndex, startIndex + limit);

    res.status(200).json({ data: paginatedComments, TotalLength: enrichedComments.length });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Error fetching comments' });
  }
};

const ApiCommentsGroupedCount = async (req, res) => {
  try {
    // Aggregating comments grouped by menuId
    const groupedComments = await userOrders.aggregate([
      { $unwind: '$orders' }, // Unwind orders array
      { $unwind: '$orders.Comments' }, // Unwind comments inside orders
      { $unwind: '$orders.Comments.MenuId' }, // Unwind each MenuId in Comments
      {
        $group: {
          _id: '$orders.Comments.MenuId', // Group by MenuId
          count: { $sum: 1 }, // Count the number of comments per MenuId
        },
      },
    ]);

    res.json(groupedComments);
  } catch (error) {
    console.error('Error fetching grouped comments:', error);
    res.status(500).json({ error: 'Failed to fetch grouped comments' });
  }
};

const ApiUserlikedMenus = async (req, res) => {
  try {
    if (req.user.id) {
      const user = await Register.findById(req.user.id);
      const userEmail = user.email; // Assume req.user contains user info
      const likedMenus = await RestaurantModel.aggregate([
        { $unwind: '$RestaurantMenu' },
        { $match: { 'RestaurantMenu.Likes.email': userEmail } },
        { $group: { _id: null, likedMenuIds: { $addToSet: '$RestaurantMenu.MenuId' } } },
      ]);

      res.json({ likedMenuIds: likedMenus[0]?.likedMenuIds || [] });
    }
  } catch (error) {
    console.error('Error fetching liked menus:', error);
    res.status(500).json({ error: 'Failed to fetch liked menus' });
  }
};

const ApiMenuslikesCount = async (req, res) => {
  try {
    const likesCounts = await RestaurantModel.aggregate([
      { $unwind: '$RestaurantMenu' },
      {
        $group: {
          _id: '$RestaurantMenu.MenuId',
          // Ensure the Likes field is treated as an array, even if it is missing
          count: { $sum: { $size: { $ifNull: ['$RestaurantMenu.Likes', []] } } },
        },
      },
    ]);

    // Convert the result to a format suitable for frontend consumption
    const likesCountMap = {};
    likesCounts.forEach(({ _id, count }) => {
      likesCountMap[_id] = count;
    });

    res.json(likesCountMap);
  } catch (error) {
    console.error('Error fetching likes counts:', error);
    res.status(500).json({ error: 'Failed to fetch likes counts' });
  }
};



let updatedUser;
const userProfile = async (req, res) => {
  try {
    if (req.user.id) {
      let updateUser;
      const user = await Register.findById(req.user.id);
      if (updatedUser) {
        if ((updatedUser._id).toString() === user._id) {
          updateUser = updatedUser;
        }
        else {
          updateUser = user;
        }
      }
      else {
        updateUser = user;
      }
      const email = user.email
      const sender_id = user._id
      var userOrder = await userOrders.findOne({ email });
      const restaurantUser = await RestaurantModel.find({ sender_id });
      res.json({ user: updateUser, userOrder: userOrder, restaurantUser: restaurantUser });
    }
    else {
      return res.status(404).json({ error: 'User not found' });
    }
    // try 
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};


const Profile = async (req, res) => {
  try {
    if (req.user.id) {
      let updateUser;
      const user = await Register.findById(req.user.id);
      if (updatedUser) {
        if ((updatedUser._id).toString() === user._id) {
          updateUser = updatedUser;
        }
        else {
          updateUser = user;
        }
      }
      else {
        updateUser = user;
      }
      var users = await Register.find({ email: { $nin: [user.email] } });
      res.json({ user: updateUser, users: users });
    }
    else {
      return res.status(404).json({ error: 'User not found' });
    }
    // try 
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateUserProfileImage = async (req, res) => {
  try {
    const imagePath = req.file.path;

    const relativeImagePath = imagePath.replace(/^.*[\\\/]/, '');
    const _id = req.body._id;

    await Register.findOneAndUpdate(
      { _id: _id },
      { $set: { image: relativeImagePath } },
      { new: true }
    );
    updatedUser = await Register.findOne({ _id: _id });

    if (updatedUser) {
      // if(req.UserForImage.id){
      var users = await Register.find({ _id: { $nin: [_id] } });
      res.status(200).json({ user: updatedUser, users: users });
      // }
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
};

const updateProfileNames = async (req, res) => {
  try {
    const imagePath = req.file.path;
    const relativeImagePath = imagePath.replace(/^.*[\\\/]/, '');
    const _id = req.body._id;
    let updated_user_firstname = req.body.firstname;
    let updated_user_lastname = req.body.lastname;
    let updated_user_Address = req.body.address;
    let updated_user_languages = req.body.language;
    const existingUser = await Register.findOne({
      firstname: { $regex: new RegExp(`^${updated_user_firstname}$`, 'i') },
      _id: { $ne: _id }, // Exclude the current user from the search
    });

    if (existingUser) {
      return res.status(400).json({ error: 'First name already exists' });
    }

    const ifDataNotFounded = await Register.findOne({ _id: _id });
    if (updated_user_firstname === '') {
      updated_user_firstname = ifDataNotFounded.firstname;
    }
    if (updated_user_lastname === '') {
      updated_user_lastname = ifDataNotFounded.lastname;
    }
    if (updated_user_Address === '') {
      updated_user_Address = ifDataNotFounded.address;
    }
    if (updated_user_languages === '') {
      updated_user_languages = ifDataNotFounded.language;
    };

    await Register.findOneAndUpdate(
      { _id: _id },
      {
        $set: {
          image: relativeImagePath,
          firstname: updated_user_firstname,
          lastname: updated_user_lastname,
          address: updated_user_Address,
          language: updated_user_languages,
        }
      },
      { new: true }
    );

    updatedUser = await Register.findOne({ _id: _id });

    if (updatedUser) {
      var users = await Register.find({ _id: { $nin: [_id] } });
      res.status(200).json({ user: updatedUser, users: users, error: 'upload successfully' });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
};

const updateProfileOtherUsers = async (req, res) => {
  try {
    const imagePath = req.file.path;
    const relativeImagePath = imagePath.replace(/^.*[\\\/]/, '');
    const _id = req.body._id;
    const Make_Admin_id = req.body.Make_Admin_id;
    let updated_user_firstname = req.body.firstname;
    let updated_user_lastname = req.body.lastname;
    let updated_user_Address = req.body.address;
    let updated_user_languages = req.body.language;
    let updated_user_admin = req.body.admin;
    let updated_user_phone = req.body.phone;
    const existingUser = await Register.findOne({
      firstname: { $regex: new RegExp(`^${updated_user_firstname}$`, 'i') },
      _id: { $ne: Make_Admin_id }, // Exclude the current user from the search
    });

    if (existingUser) {
      return res.status(400).json({ error: 'First name already exists' });
    }

    const existingUserPhoneNo = await Register.findOne({
      phone: updated_user_phone,
      _id: { $ne: Make_Admin_id }, // Exclude the current user from the search
    });

    if (existingUserPhoneNo) {
      return res.status(400).json({ error: 'Phone Number already exists' });
    }

    const ifDataNotFounded = await Register.findOne({ _id: Make_Admin_id });
    if (updated_user_firstname === '') {
      updated_user_firstname = ifDataNotFounded.firstname;
    }
    if (updated_user_lastname === '') {
      updated_user_lastname = ifDataNotFounded.lastname;
    }
    if (updated_user_Address === '') {
      updated_user_Address = ifDataNotFounded.address;
    }
    if (updated_user_languages === '') {
      updated_user_languages = ifDataNotFounded.language;
    };

    const upadeUserSend = await Register.findOneAndUpdate(
      { _id: Make_Admin_id },
      {
        $set: {
          image: relativeImagePath,
          firstname: updated_user_firstname,
          lastname: updated_user_lastname,
          address: updated_user_Address,
          language: updated_user_languages,
          admin: updated_user_admin,
          phone: updated_user_phone,
        }
      },
      { new: true }
    );

    updatedUser = await Register.findOne({ _id: _id });

    if (updatedUser) {
      // var users = await Register.find({ _id: { $nin: [_id] } });
      res.status(200).json({ user: upadeUserSend, error: 'upload successfully' });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
};

const DeleteProfileOtherUsers = async (req, res) => {
  try {
    const _id = req.body._id;
    const DeleteUser_id = req.body.DeleteUser_id;
    const existingUser = await Register.findOne({ _id: DeleteUser_id });

    if (!existingUser) {
      return res.status(400).json({ error: 'already Deleted' });
    }

    await Register.deleteOne({ _id: DeleteUser_id });

    updatedUser = await Register.findOne({ _id: _id });

    if (updatedUser) {
      var users = await Register.find({ _id: { $nin: [_id] } });
      res.status(200).json({ user: updatedUser, users: users, error: 'Deleted successfully' });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
};



const logOut = async (req, res, next) => {
  try {
    res.clearCookie('access_token');
    res.json({ error: 'Successfully logOut' });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: 'Server error' });
  }
};


module.exports = {
  register,
  login,
  logOut,
  restaurantsApi,
  restaurantsApiMenu,
  restaurantsApiDeal,
  restaurantsApiGet,
  restaurantsApiMenuGet,
  restaurantsApiMenuGetPage,
  restaurantsApiMenuPUT,
  restaurantsApiMenuUpDate,
  restaurantsApiupdateDeal,
  searchdishesGet,
  Get_delivery_Notification,
  setupSocketIoListeners,
  BecomedeliveryBoy,
  userProfile,
  Cart,
  HomeRestaurant,
  CartCoupens,
  ordersInProgress,
  submitRating,
  Deliveryboy_sent_AcceptRequest,
  ApiComments,
  ApiCommentsGroupedCount,
  ApiUserlikedMenus,
  ApiMenuslikesCount,


  Profile,
  updateUserProfileImage,
  updateProfileNames,
  updateProfileOtherUsers,
  DeleteProfileOtherUsers,
}