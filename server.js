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
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Require cors
const cors = require("cors")

// Cors for cross origin allowance
app.use(cors());

// Initialize the main project folder
app.use(express.static("website"));

// Setup Server
app.listen(PORT, () => {
  console.log("The server is now running on port:", PORT);
})

app.get("/all", (req, res) => {
  console.log("• GET request '/all'");
  console.log("Response:", projectData);

  res.setHeader("Content-Type", "application/json")
  .status(200)
  .send(JSON.stringify(projectData))
});

app.post("/add", (req, res) => {
  console.log("• POST request '/add'");
  console.log("Body:", req.body);

  projectData = {
    date: req.body.date,
    temperature: req.body.temperature,
    content: req.body.content
  }
  res.setHeader("Content-Type", "application/json")
  .status(200)
  .send(JSON.stringify({
    message: "Data has been posted"
  }))
})