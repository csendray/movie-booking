const http = require("http");

// Create the server
const server = http.createServer((req, res) => {
  // Set the response header
  res.setHeader("Content-Type", "application/json");

  // Check the incoming request URL and method
  if (req.method === "GET") {
    if (req.url === "/movies") {
      // Simulate response for /movies API
      res.statusCode = 200;
      res.end(
        JSON.stringify({
          message: "All Movies Data in JSON format from Mongo DB",
        })
      );
    } else if (req.url === "/genres") {
      // Simulate response for /genres API
      res.statusCode = 200;
      res.end(
        JSON.stringify({
          message: "All Genres Data in JSON format from Mongo DB",
        })
      );
    } else if (req.url === "/artists") {
      // Simulate response for /artists API
      res.statusCode = 200;
      res.end(
        JSON.stringify({
          message: "All Artists Data in JSON format from Mongo DB",
        })
      );
    } else {
      // Handle unknown routes
      res.statusCode = 404;
      res.end(JSON.stringify({ message: "Route Not Found" }));
    }
  } else {
    // Handle other HTTP methods (e.g., POST, PUT, DELETE)
    res.statusCode = 405;
    res.end(JSON.stringify({ message: "Method Not Allowed" }));
  }
});

// Server listens on port 9000
server.listen(9000, () => {
  console.log("Server is running on http://localhost:9000");
});
