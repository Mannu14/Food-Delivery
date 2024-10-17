const mongoose = require("mongoose");

// Counter Schema to generate unique 6-digit IDs
const CounterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  seq: { type: Number, default: 100000 }
});

const Counter = mongoose.model('Counter', CounterSchema);

// Function to get the next 6-digit sequence number for Restaurants
async function getNextSequence(name) {
  const counter = await Counter.findOneAndUpdate(
    { name: name },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
}

// Schema for Menu
const MenuSchema = new mongoose.Schema({
  MenuId: {
    type: Number,
    unique: true
  },
  ItemName: String,
  Price: {
    type: String,
  },
  discount: String,
  description: String,
  image: String,
  IsVeg: String,
  InStock: String,
  Ratings: [{
    Rating: Number,
    RatingCount: Number
  }],
  Likes: [{
    email:String
}],
}, { timestamps: true });

// Pre-save middleware to generate a unique 6-digit MenuId
MenuSchema.pre('save', async function (next) {
  if (!this.MenuId) {
    this.MenuId = await getNextSequence('menu');
  }
  next();
});

// Schema for DealsForYou (similar to MenuSchema)
const DealsForYouSchema = new mongoose.Schema({
  MenuId: {
    type: Number,
    unique: true
  },
  ItemName: String,
  Price: {
    type: String
  },
  discount: String,
  description: String,
  image: String,
  IsVeg: String,
}, { timestamps: true });

// Pre-save middleware to generate a unique 6-digit DealsForYou MenuId
DealsForYouSchema.pre('save', async function (next) {
  if (!this.MenuId) {
    this.MenuId = await getNextSequence('dealsForYou');
  }
  next();
});

// Schema for Restaurant
const RestaurantSchema = new mongoose.Schema({
  sender_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
  RestaurantEmailId: {
    type: String
  },
  RestaurantId: {
    type: Number,
    unique: true
  },
  RestaurantImgage: {
    type: String
  },
  RestaurantName: {
    type: String
  },
  RestaurantPhone: {
    type: Number
  },
  Ratings: [{
    Rating: Number,
    RatingCount: Number
  }],
  Availabitity: [{
    OpningTime: String,
    ClosingTime: String
  }],
  RestaurantMenu: [MenuSchema],
  DealsByRestaurant: [DealsForYouSchema],
  RestaurantLocation: [{
    area: String,
    district: String,
    lat: String,
    lng: String,
    pincode: Number,
    state: String,
  }],
}, { timestamps: true });

// Pre-save middleware to generate a unique 6-digit RestaurantId
RestaurantSchema.pre('save', async function (next) {
  if (!this.RestaurantId) {
    this.RestaurantId = await getNextSequence('restaurant');
  }
  next();
});

const RestaurantModel = mongoose.model("Restaurant", RestaurantSchema);
module.exports = { RestaurantModel, Counter, getNextSequence };
