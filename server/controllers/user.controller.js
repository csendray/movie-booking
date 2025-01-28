const User = require("../models/user.model.js");
const Movie = require("../models/movie.model.js"); // Movie contains Show schema
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const Joi = require("joi");

// 🔐 Middleware to extract `userId` from JWT (applied in `routes/userRoutes.js`)
const authMiddleware = require("../middlewares/authMiddleware");

// 📌 Sign-Up Validation Schema
const signUpSchema = Joi.object({
  email: Joi.string().email().required(),
  first_name: Joi.string().min(2).max(50).required(),
  last_name: Joi.string().min(2).max(50).required(),
  contact: Joi.string()
    .pattern(/^\d{10}$/)
    .required(),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[A-Z])(?=.*\d).{8,}$/) // At least 1 uppercase, 1 number
    .required(),
});

// 📝 **User Sign-Up**
exports.signUp = async (req, res) => {
  try {
    // Validate request body
    console.log(req.body);

    const { error } = signUpSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, first_name, last_name, contact, password } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Generate unique `userid`
    const lastUser = await User.findOne().sort({ userid: -1 });
    const userId = lastUser ? lastUser.userid + 1 : 1;

    // Generate username
    const username = `${first_name.toLowerCase()}${last_name.toLowerCase()}`;

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log(username, hashedPassword);

    // Generate JWT token
    const accessToken = jwt.sign(
      { userId, email, username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Assign random coupons
    const initialCoupons = [
      {
        id: Math.floor(100 + Math.random() * 900),
        discountValue: 51,
        isUsed: false,
      },
      {
        id: Math.floor(100 + Math.random() * 900),
        discountValue: 49,
        isUsed: false,
      },
    ];

    // Create new user
    const user = new User({
      userid: userId,
      email,
      first_name,
      last_name,
      username,
      contact,
      password: hashedPassword,
      role: "user",
      isLoggedIn: false,
      uuid: uuidv4(),
      accesstoken: accessToken,
      coupens: initialCoupons,
      bookingRequests: [],
    });

    console.log(user);

    console.log("NODE_ENV:", process.env.NODE_ENV); // Should print: development

    // Save user
    await user.save();

    // Send secure cookie with JWT
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(201).json({
      message: "User registered successfully",
      user: { userid: user.userid, email: user.email, username: user.username },
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error during sign-up", error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    let { username, password } = req.body;

    if (req.basicAuth) {
      username = req.basicAuth.username;
      password = req.basicAuth.password;
    }

    // ✅ Find user
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    // ✅ Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    // ✅ Generate JWT token
    const accessToken = jwt.sign(
      { userId: user.userid, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("✅ Token Generated:", accessToken);

    // ✅ Send the token in the response **exactly as expected by frontend**
    res.setHeader("access-token", accessToken); // ✅ Ensure token is sent in headers
    res.json({
      message: "Login successful",
      username: user.username,
      id: user._id,
      "access-token": accessToken, // ✅ Ensure key matches what frontend expects
    });
  } catch (error) {
    res.status(500).json({ message: "Login error", error: error.message });
  }
};

// 🚪 **User Logout**
exports.logout = async (req, res) => {
  try {
    res.clearCookie("accessToken");
    res.json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Logout error", error: error.message });
  }
};

// 📌 **Get Coupon Code for Logged-In User**

exports.getCouponCode = async (req, res) => {
  try {
    console.log("🔍 Authenticated User:", req.user);

    // ✅ Extract user ID from JWT
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    // ✅ Find user in database
    const user = await User.findOne({ userid: userId });
    if (!user) return res.status(404).json({ message: "User not found" });

    console.log("🔍 Coupon Request Query:", req.query);

    // ✅ Ensure coupon code is a number
    const code = parseInt(req.query.code, 10);
    console.log(code);

    if (isNaN(code))
      return res.status(400).json({ message: "Invalid coupon code format" });

    // ✅ Find the coupon in user's array
    console.log(user);

    const coupon = user.coupens.find((c) => c.discountValue === code);
    console.log(coupon);

    if (!coupon) return res.status(404).json({ message: "Coupon not found" });
    if (coupon.isUsed)
      return res.status(400).json({ message: "Coupon already used" });

    // ✅ Send response with discount value
    res.json({
      message: "Coupon retrieved successfully",
      discountValue: coupon.discountValue,
    });
  } catch (err) {
    console.error("🚨 Error retrieving coupon:", err.message);
    res
      .status(500)
      .json({ message: "Error retrieving coupon", error: err.message });
  }
};

exports.bookShow = async (req, res) => {
  try {
    console.log(req.user);

    const userId = req.user?.userId;
    console.log("userId :", userId);

    if (!userId)
      return res.status(401).json({ message: "Unauthorized: Invalid token" });

    console.log("📝 Received Booking Request:", req.body);

    const { bookingRequest } = req.body;
    if (!bookingRequest) {
      return res
        .status(400)
        .json({ message: "Missing bookingRequest in request body" });
    }

    const { coupon_code, show_id, tickets } = bookingRequest;
    console.log("🔍 Extracted Values:", { coupon_code, show_id, tickets });

    // ✅ Parse tickets correctly
    let ticketCount = 0;
    if (Array.isArray(tickets) && tickets.length > 0) {
      ticketCount = parseInt(tickets[0], 10);
    } else {
      ticketCount = parseInt(tickets, 10);
    }
    console.log("ticket count :", ticketCount);

    if (!Number.isInteger(ticketCount) || ticketCount < 1) {
      return res.status(400).json({ message: "Invalid number of tickets" });
    }

    // ✅ Ensure show_id is a valid number
    let showObjectId = parseInt(show_id, 10);
    if (isNaN(showObjectId)) {
      return res.status(400).json({ message: "Invalid show ID format" });
    }

    // ✅ Fix User Query: Search using `userid` instead of `_id`
    const user = await User.findOne({ userid: userId });
    if (!user) return res.status(404).json({ message: "User not found" });

    // ✅ Find the movie and show
    const movie = await Movie.findOne({ "shows.id": showObjectId }).select(
      "shows"
    );
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    const show = movie.shows;
    if (!show) return res.status(404).json({ message: "Show not found" });
    console.log("show :", show);

    const available_seats = show[0].available_seats;

    console.log("show.available_seats:", available_seats);
    if (ticketCount > available_seats) {
      return res.status(400).json({ message: "Not enough seats available" });
    }

    // ✅ Generate Reference Number
    const reference_number = Math.floor(100000 + Math.random() * 900000);

    console.log("booking refferance number:", reference_number);

    // ✅ Create booking request object
    const bookingRequestObj = {
      reference_number,
      coupon_code: coupon_code || null,
      show_id: showObjectId,
      tickets: ticketCount,
      // totalPrice,
      bookedAt: new Date(),
    };
    console.log("Booking Request :", bookingRequestObj);
    console.log("User :", user);
    console.log("Show :", show);

    // ✅ Start MongoDB transaction
    session = await mongoose.startSession(); // ✅ Assign session to variable
    await session.withTransaction(async () => {
      user.bookingRequests.push(bookingRequestObj);
      show.available_seats -= ticketCount;

      await user.save({ session });
      await movie.save({ session });
    });

    session.endSession();

    return res.status(201).json({
      message: "Booking successful",
      reference_number,
      // totalPrice,
    });
  } catch (error) {
    console.error("❌ Error during transaction:", error);

    // ✅ Ensure session is active before aborting transaction
    if (session && session.inTransaction()) {
      await session.abortTransaction();
    }

    if (session) {
      session.endSession();
    }

    return res.status(500).json({
      message: "Error booking show",
      error: error.message,
    });
  }
};
