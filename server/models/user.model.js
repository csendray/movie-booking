const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  discountValue: { type: Number, required: true },
});

const bookingRequestSchema = new mongoose.Schema({
  reference_number: { type: Number, required: true, unique: true },
  coupon_code: { type: Number, default: null },
  show_id: { type: Number, required: true }, // ✅ Kept as `Number`
  tickets: { type: Number, required: true }, // ✅ Changed from Array to Number
  bookedAt: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema({
  userid: { type: Number, required: true, unique: true },
  email: { type: String, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  username: { type: String, required: true },
  contact: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  isLoggedIn: { type: Boolean, default: false },
  uuid: { type: String, required: true },
  accesstoken: { type: String, required: true },
  coupens: [couponSchema], // ✅ Coupon array
  bookingRequests: [bookingRequestSchema], // ✅ Embedded booking requests
});

const User = mongoose.model("User", userSchema);
module.exports = User;
