const Product = require("../models/productModel");
const UserM = require("../models/userModel");
const Cart = require("../models/cartModel");
const Coupon = require("../models/couponModel");

const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");
const cloudinary = require("cloudinary");
const path = require("path");

// cart 
exports.userCart = catchAsyncErrors(async (req, res) => {
    console.log(req.body);
    const { _id } = req.user._id;
 
    try {
        // if (!cart || !Array.isArray(cart) || cart.length === 0) {
        //     // Handle the case where cart is undefined, not an array, or empty
        //     return res.status(400).json({
        //         success: false,
        //         message: "Invalid cart data",
        //     });
        // }
 

        // let products = [];
        const user = await UserM.findById(_id);
        // Check if the user already has a cart
        const alreadyExistCart = await Cart.findOne({ orderby: user._id }).populate("products.product");
  
            let object = {};
            object.product = req.body._id;
            object.quantity = req.body.quantity;
            let getPrice = await Product.findById(req.body._id).select("price").exec();
            object.price = getPrice.price;
            
         if (alreadyExistCart) {
            // If a cart already exists, remove it
             alreadyExistCart.products.push(object);
              
             let cartTotal = 0;
             
             for (let i = 0; i < alreadyExistCart.products.length; i++) {
                 cartTotal = cartTotal+ alreadyExistCart.products[i].price * alreadyExistCart.products[i].quantity;
             }
             alreadyExistCart.cartTotal = cartTotal;
            
             const data = await alreadyExistCart.save();
            console.log(data);
            res.json(data);
        }else{
          let cartTotal = 0; 
              cartTotal = cartTotal+ object.price * object.quantity;
          let products = [];
          products.push(object);
          let newCart = await new Cart({
            products,
            cartTotal,
            orderby: user?._id,
          }).save();
          res.json(newCart);
        }
    } catch (error) {
        throw new Error(error);
    }
 });


//  get user cart
exports.getUserCart = catchAsyncErrors(async (req, res) => {

    const {_id} = req.user;
    try {
        const cart = await Cart.findOne({orderby:_id}).populate("products.product");
         
        res.json(cart);
    } catch (error) {
        throw new Error(error)
        
    }
})
//  empty cart
exports.emptytCart = catchAsyncErrors(async (req, res) => {

    const {_id} = req.user;
    try {
        const user = await UserM.findOne({_id});
        const cart = await Cart.findOneAndRemove({orderby:user._id});
        res.json(cart);
    } catch (error) {
        throw new Error(error)
        
    }
});

// apply coupon 
exports.applyCoupon = catchAsyncErrors(async (req, res) => {
    const { coupon } = req.body;
    const { _id } = req.user;
    try {
      const validCoupon = await Coupon.findOne({ name : coupon });
     
      if (!validCoupon === null) {
        throw new Error('Invalid Coupon');
      }
      

      const user = await UserM.findOne({ _id });

      let cartt = await Cart.findOne({ orderby: user._id }).populate("products.product");
  
      if (cartt) {
        const cartTotal = cartt.cartTotal;
         
        let totalAfterDiscount = 0;
         
         if(validCoupon.percentage ==  false){
           
            totalAfterDiscount = (cartTotal - validCoupon.discount).toFixed(2);
          }else{
            console.log(validCoupon);
            totalAfterDiscount = (cartTotal - (cartTotal * validCoupon.discount) / 100).toFixed(2);
          }
        // let totalAfterDiscount = (cartTotal - (cartTotal * validCoupon.discount) / 100).toFixed(2);
        // console.log("asdasD"+totalAfterDiscount);
        await Cart.findOneAndUpdate(
          { orderby: user._id },
          { totalAfterDiscount },
          { new: true }
        );
        res.status(200).json({
          success: true,
          message: "Applied the coupon successfully",
          amount:totalAfterDiscount,
          message: `your total amount After Discount is ${totalAfterDiscount}`,
        });
      } else {
        // Handle the case where cartTotal is undefined
        res.status(400).json({
          success: false,
          message: 'Cart is empty',
        });
      }
    } catch (error) {
      throw new Error(error);
    }
  });






























//  commmetn
