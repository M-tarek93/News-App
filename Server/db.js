const mongoose = require('mongoose');
// Setting database name from the env. variable or newsApp by default
const database = process.env.DATABASE || "newsApp";

// Used to connect to the database
const connect = () => {
    mongoose.connect(`mongodb://localhost:27017/${database}`, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
        useFindAndModify: false
    }, (err) => {
        if (!err) console.log("Connection to MongoDB started");
        else console.log("Error while connecting to MongoDB ");
    })
}

module.exports = { connect };