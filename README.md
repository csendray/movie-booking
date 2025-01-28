# 🎬 Movie Booking System

A full-stack **Movie Booking System** built with **React (Frontend) + Node.js/Express (Backend) + MongoDB (Database)**. This application allows users to browse movies, book tickets, and manage their reservations.

✅ 1. Features Implementation
1.1 Required Node Modules
All required dependencies are installed and configured correctly in package.json:

Module Version Installed Status
b2a 1.1.2 ✅ Installed
body-parser 1.20.3 ✅ Installed
cors 2.8.5 ✅ Installed
express 4.21.1 ✅ Installed
mongoose 8.7.3 ✅ Installed
uuid-token-generator 1.0.0 ✅ Installed
uuidv4 6.2.13 ✅ Installed
1.2 Configuration Section
✅ MongoDB credentials and connectivity details are properly configured.
✅ The configuration module is exported and referenced in other modules.
1.3 Main Entry Point (server.js)
✅ Express and Cors are imported.
✅ Models and Routes are imported.
✅ Middleware is used for route handling.
✅ Database connectivity is established.
✅ Prints "Server is running on port 8085" when started.
1.4 Models Implementation
The following Mongoose models are properly implemented:

✅ Artist Model
✅ Genre Model
✅ Movie Model
✅ User Model
1.5 Controller Implementation
The required controller methods are properly implemented:

Controller Method Status
ArtistController findAllArtists() ✅ Implemented
GenreController findAllGenres() ✅ Implemented
MovieController findAllMovies() ✅ Implemented
MovieController findOne() ✅ Implemented
MovieController findShows() ✅ Implemented
1.6 Security Implementation
✅ User Authentication (signUp, login, logout)
✅ Coupon Code Retrieval (getCouponCode())
✅ Booking System (bookShow())
1.7 Routing Implementation
The following routes are correctly mapped to controllers:

# API Endpoint Method Controller Status

/api/artists GET findAllArtists ✅ Implemented
/api/genres GET findAllGenres ✅ Implemented
/api/movies GET findAllMovies ✅ Implemented
/api/movies/:id GET findOne ✅ Implemented
/api/movies/:id/shows GET findShows ✅ Implemented
/auth/signup POST signUp ✅ Implemented
/auth/login POST login ✅ Implemented
/auth/logout POST logout ✅ Implemented
/auth/bookings POST bookShow ✅ Implemented
/auth/coupons GET getCouponCode ✅ Implemented

# ✅ 2. Adherence to Coding Guidelines

2.1 Code Formatting
✅ Google Coding Guidelines are followed.
✅ Code is well-structured and modularized.
✅ Proper indentation and spacing are used.
2.2 Code Readability
✅ camelCase naming convention is used for variables and functions.
✅ Variable names are descriptive and represent their functionality.
✅ Code is well-commented, explaining complex logic.

###########################################################################################################

1️⃣ User Sign-Up
🔹 Endpoint: POST /api/auth/signup
🔹 Description: Registers a new user
🔹 Headers: Content-Type: application/json
🔹 Body Parameters (JSON):
{
"email": "flast@app.com",
"first_name": "First",
"last_name": "Last",
"contact": "9876543210",
"password": "Password01"
}
🔹 Success Response (201 Created)
{
"message": "User registered successfully",
"user": { "userid": 7, "email": "flast@app.com", "username": "firstlast" }
}
🔹 Error Responses (400 / 500)
{
"message": "User already exists"
}

###########################################################################################################
2️⃣ User Login
🔹 Endpoint: POST /api/auth/login
🔹 Headers: Content-Type: application/json
🔹 Body Parameters:
{
"username": "firstlast",
"password": "Password01"
}
Success Response (200 OK)
{
"message": "Login successful",
"username": "firstlast",
"id": "6798cca4409b1c3899b28c3e",
"access-token": "eyJhbGciOiJIUzI1NiIsIn..."
}
############################################################################################################
