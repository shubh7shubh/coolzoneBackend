// const mongoose = require("mongoose");

// const userSchema = mongoose.Schema({
//     mobileNo: {
//         type: Number,
//     },
//     otp: {
//         type: Number,
//     },

// });

// const otpModel = mongoose.model("otp", userSchema);

// module.exports = otpModel;

const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
    {
        mobileNo: {
            type: String,
            required: true,
        },
        otp: {
            type: String,
            required: true,
        },
        createdAt: { type: Date, default: Date.now, index: { expires: 300 } },

        // After 5 minutes it deleted automatically from the database
    },
    {
        timestamps: true,
    }
);

const otpModel = mongoose.model("otp", otpSchema);

module.exports = otpModel;