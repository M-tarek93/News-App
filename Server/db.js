const mongoose = require('mongoose');

const database = process.env.DATABASE || "newsApp";
export const connect = () => {
    mongoose.connect(`mongodb://localhost:27017/${database}`, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
        useFindAndModify: false
    }, (err) => {
        if (!err) console.log("Connection to MongoDB started");
        else console.log("Error while connecting to MongoDB ",err);
    })
}