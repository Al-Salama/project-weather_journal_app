// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Global variables
const PORT = 2023;

// Require Express to run server and routes
const express = require("express");

// Start up an instance of app
const app = express();

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
express.json();
express.urlencoded({ extended: false });

// Cors for cross origin allowance
app.use(cors());

// Initialize the main project folder
app.use(express.static("website"));

// Setup Server
app.listen(PORT, () => {
  console.log("The server is now running on port:", PORT);
})

