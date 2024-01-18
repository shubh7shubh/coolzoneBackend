const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    orderDetails: {
        newCustomer: {
            type: Boolean,
            required: true,
            default: false,
        },

        customerName: {
            type: String,
            required: true,
        },
        customerEmail: {
            type: String,
            required: true,
        },
        phoneNo: {
            type: Number,
            required: true,
        },

        paymentType: {
            type: String,
            required: true,
        },
        orderType: {
            type: String,
            required: true,
        },


    },

    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    orderStatus: {
        type: String,
        required: true,
        default: "Processing",
    },
    orderNote: {
        type: String,
        required: true,
    },

    orderItems: [
        {
            name: {
                type: String,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            image: {
                type: String,
                required: true,
            },
            product: {
                type: mongoose.Schema.ObjectId,
                ref: "Product",
                required: true,
            },
        },
    ],
    itemsPrice: {
        type: Number,
        required: true,
        default: 0,
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0,
    },//yha tak 
    deliveredAt: Date,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Order", orderSchema);
