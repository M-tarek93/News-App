require("dotenv").config();
const express = require("express");
const db = require("./Server/db");
const cors = require("cors");
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const userRouter = require("./Server/routes/users");
const authRouter = require("./Server/routes/authentication");
const newsRouter = require("./Server/routes/news");
const path = require('path');
const limit = require('express-limit').limit;

// Getting the port number from env. variables or setting it to 5000 by default
const port = process.env.PORT || 5000;
// Using express module to create the app
// file deepcode ignore UseCsurfForExpress: <please specify a reason of ignoring this>
const app = express();

// Attempting to connect to the database
db.connect();

// Setting CORS options to be used
const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
  methods: "GET,POST,OPTIONS",
  credentials: true,
};

// Applying middlewre of helmet, CORS, JSON parser, and Cookie parser(Signs cookies with a key)
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

// Attaching routers to the application
app.use("/users", userRouter);
app.use("/auth", authRouter);
app.use("/news", newsRouter);

// Handles any requests that don't match the ones above
app.use(limit({
  max:    25,        // 25 requests
  period: 60 * 1000 // per minute (60 seconds)
}), express.static(path.join(__dirname, 'Client/build'))); 
app.get('*', limit({
  max:    25,        // 25 requests
  period: 60 * 1000 // per minute (60 seconds)
}), (req,res) =>{
    res.sendFile(path.join(__dirname+'/Client/build/index.html'));
});

// Starting listening
app.listen(port, (err) => {
  if (!err) console.log("started News-App back-end server");
});
