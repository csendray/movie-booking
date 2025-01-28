const jwt = require("jsonwebtoken");
const atob = require("atob"); // Decode Base64

exports.authMiddleware = (req, res, next) => {
  console.log("🔍 Headers Received:", req.headers);

  let token = req.cookies?.accessToken; // ✅ Check cookies first

  // ✅ If token is missing, check Authorization Header (Bearer or Basic)
  if (!token && req.headers.authorization) {
    const authHeader = req.headers.authorization;
    console.log("🔍 Authorization Header:", authHeader);

    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1]; // ✅ Extract Bearer token
    } else if (authHeader.startsWith("Basic ")) {
      // ✅ Extract credentials from Basic Auth
      const credentials = atob(authHeader.split(" ")[1]); // Decode Base64
      const [username, password] = credentials.split(":");

      // ✅ Find User by username
      req.basicAuth = { username, password }; // Attach to request
    }
  }

  if (req.basicAuth) return next(); // ✅ Proceed if Basic Auth is used
  console.log(token);

  if (!token || token === "undefined") {
    console.log("🚨 No valid token found, access denied!");
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next(); // ✅ Proceed if token is valid
  } catch (error) {
    console.log("🚨 Token verification failed:", error.message);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
