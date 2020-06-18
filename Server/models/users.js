const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true, minlength: 4, maxlength: 30 },
    email: { type: String, required: true, unique: true,
        match:
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    },
    password: { type: String, required: true, minlength: 8 },
    sources: [{ type: String }]
})

userSchema.pre('save', async function (next) {
    if (this.isNew) {
    this.password = await bcrypt.hash(this.password, 10)
    next();
    }
});

const userModel = mongoose.model('User', userSchema);
module.exports = userModel;