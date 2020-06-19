const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true, minlength: [6, 'Full Name must be at least 6 characters'], maxlength: [30, 'Full Name must be less than 30 characters.'] },
    email: { type: String, required: true, unique: true,
        match:
            [/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "Invalid email format"]
    },
    password: { type: String, required: true, minlength: [8, "Password must be at least 8 characters"] },
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