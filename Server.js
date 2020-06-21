require("dotenv").config();
const express = require("express");
const db = require("./Server/db");
const cors = require("cors");

const userRouter = require("./Server/routes/users");
const authRouter = require("./Server/routes/authentication");
const newsRouter = require("./Server/routes/news");

const port = process.env.PORT || 5000;
const app = express();

db.connect();

const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
  methods: "GET,POST,OPTIONS"
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/users", userRouter);
app.use("/auth", authRouter);
app.use("/news", newsRouter);

app.listen(port, (err) => {
  if (!err) console.log(`started News-App back-end server on port ${port}`);
});
