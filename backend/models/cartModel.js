// // models/cart.js

// const mongoose = require('mongoose');

// const cartSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User', // Assuming you have a User model for authentication
//     required: true,
//   },
//   cartItems: [
//     {
//       productId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Product', // Assuming you have a Product model
//         required: true,
//       },
//       quantity: {
//         type: Number,
//         required: true,
//       },
//     },
//   ],
//   shippingInfo: {
//     address: String,
//     city: String,
//     state: String,
//     country: String,
//     pinCode: String,
//   },
//   subtotal: {
//     type: Number,
//     default: 0,
//   },
//   tax: {
//     type: Number,
//     default: 0,
//   },
//   discount: {
//     type: Number,
//     default: 0,
//   },
//   shippingCharges: {
//     type: Number,
//     default: 0,
//   },
//   discount: {
//     type: Number,
//     default: 0,
//   },
//   total: {
//     type: Number,
//     default: 0,
//   },
// });

// const Cart = mongoose.model('Cart', cartSchema);

// // module.exports = Cart;
