const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    mobileNo: {
        type: Number,
    },
    otp: {
        type: Number,
    },

});

const otpModel = mongoose.model("otp", userSchema);

module.exports = otpModel;