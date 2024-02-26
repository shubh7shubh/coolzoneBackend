// const Product = require("../models/productModel");
// const UserM = require("../models/userModel");
// // const Cart = require("../models/cartModel");
// const Coupon = require("../models/couponModel");

// const ErrorHander = require("../utils/errorhander");
// const catchAsyncErrors = require("../middleware/catchAsyncErrors");
// const ApiFeatures = require("../utils/apifeatures");
// const cloudinary = require("cloudinary");
// const path = require("path");

// // routes/cart.js

// const express = require('express');
// const router = express.Router();
// const Cart = require('../models/cart');

// // Route to add a product to the cart
// exports.addToCart = catchAsyncErrors(async (req, res) => {
//   try {
//     const { _id } = req.user;

//     const { productId, quantity } = req.body;


//     // Find the user's cart or create a new one
//     let userCart = await Cart.findOne({ _id });

//     if (!userCart) {
//       userCart = new Cart({
//         userId,
//         cartItems: [],
//       });
//     }

//     // Check if the product is already in the cart
//     const existingCartItem = userCart.cartItems.find(
//       (item) => item.productId.toString() === productId
//     );

//     if (existingCartItem) {
//       // If the product is already in the cart, update the quantity
//       existingCartItem.quantity += quantity;
//     } else {
//       // If the product is not in the cart, add it
//       userCart.cartItems.push({ productId, quantity });
//     }

//     // Update the subtotal, tax, and total in the cart
//     userCart.subtotal = calculateSubtotal(userCart.cartItems);
//     userCart.tax = calculateTax(userCart.subtotal);
//     userCart.shippingCharges = calculateShippingCharges(cartItemsTotal);
//     userCart.total = calculateTotal(userCart.subtotal, userCart.tax, userCart.shippingCharges, userCart.discount);

//     // Save the updated cart to the database
//     await userCart.save();

//     res.status(200).json({ message: 'Product added to cart successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // Helper functions to calculate subtotal, tax, and total
// const calculateSubtotal = async (cartItems) => {
//   let subtotal = 0;

//   for (const item of cartItems) {
//     // Fetch the product details from the Product model
//     const product = await Product.findById(item.productId);

//     if (product) {
//       // Assuming item.quantity is the quantity of the product in the cart
//       subtotal += product.price * item.quantity;
//     }
//   }

//   return subtotal;
// };

// const calculateTax = (subtotal) => {
//   // Assuming tax is 18% of the subtotal
//   return Math.round(subtotal * 0.18);
// };

// const calculateTotal = (subtotal, tax, shipping, discount) => {
//   return subtotal + tax + shipping - discount;
// };

// // Helper function to calculate shipping charges
// const calculateShippingCharges = (cartItemsTotal) => {
//   // If cart items total is lower than 1000, set shipping charges to 200; otherwise, set it to 0
//   return cartItemsTotal < 1000 ? 200 : 0;
// };

