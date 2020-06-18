require('dotenv').config();
const express = require('express');
const db = require('./Server/db');
const cors = require('cors');


const port = process.env.PORT || 5000;
const app = express();

db.connect();

app.use(cors());
app.use(express.json())

app.listen(port, (err) => {
    if (!err) console.log(`started News-App back-end server on port ${port}`)
})