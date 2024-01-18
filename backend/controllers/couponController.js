const couponModel = require("../models/couponModel");
const Product = require("../models/productModel");
const UserM = require("../models/userModel");
const Cart = require("../models/cartModel");
const userModel = require("../models/userModel");
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");



// Create Coupon -- Admin
exports.createCoupon = catchAsyncErrors(async (req, res, next) => {
 try {
    const newCoupon = await couponModel.create(req.body);
    console.log(newCoupon);
    res.status(200).json({
      success: true,
      message:"your coupon has Created successfully",
      createdCoupon:newCoupon
    });
    
 } catch (error) {
    throw new Error(error)
 }
  
});

// // Get All Coupons
exports.getAllCoupons = catchAsyncErrors(async (req, res, next) => {
  try {
    const Coupons = await couponModel.find();
    res.status(200).json({
      success: true,
      message:"your All Coupons Listed Below",
      allCouponList:Coupons
    });

  } catch (error) {
    throw new Error(error)
  }
});


// // Delete Coupons

exports.deleteCoupon = catchAsyncErrors(async (req, res, next) => {
    const {id} = req.params
    try {
      const deleteCoupon = await couponModel.findByIdAndDelete(id,req.body);
      res.status(200).json({
        success: true,
        message:"your coupon has deleted successfully",
        deletedCoupon:deleteCoupon
      });
    } catch (error) {
      throw new Error(error)
    }
});

//update coupon details 
 
exports.updateCoupon = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params; // Get the coupon ID from the request parameters
  
  try {
    const updatedCoupon = await couponModel.findByIdAndUpdate(
      id, // Find the coupon by its ID
      req.body, // Update with the data from the request body
      { new: true, runValidators: true } // Options: new returns the modified document, runValidators ensures the model's validators are run
    );

    if (!updatedCoupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Coupon updated successfully',
      updatedCoupon,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update coupon',
      error: error.message,
    });
  }
});




// // User login endpoint
// exports.userLogin = catchAsyncErrors(async (req, res, next) => {
//   const userId = req.user.id; 
//   const user = await userModel.findById(userId);

//   // Check if it's the user's first login
//   if (user.isFirstTimeLogin) {
//     try {
//       // Get the coupon details from the request body
//       const { name, expiry, discount } = req.body;

//       // Create a welcome coupon with the provided details
//       const welcomeCoupon = {
//         name: name || "Welcome Discount", // Default to "Welcome Discount" if not provided
//         expiry: expiry || new Date("2023-12-31"), // Default expiry date if not provided
//         discount: discount || 10, // Default discount amount if not provided
//       };

//       const newCoupon = await couponModel.create(welcomeCoupon);

//       // You can associate the coupon with the user in your database here if needed

//       // Update the user's isFirstTimeLogin field to false
//       user.isFirstTimeLogin = false;
//       await user.save();

//       res.status(200).json({
//         success: true,
//         message: "Welcome coupon has been applied.",
//         coupon: newCoupon,
//       });
//       console.log(newCoupon);
//     } catch (error) {
//       // Handle any errors that occur during coupon creation
//       res.status(500).json({
//         success: false,
//         message: "Error creating and applying welcome coupon.",
   
//         error: error.message,
//       });
//     }
//   } else {
//     // User has already used the welcome coupon
//     res.status(200).json({
//       success: true,
//       // usedCoupon:usedcoupon,
//       message: "Welcome coupon has already been used.",
//     });
//   }
// });


// =======================

// User login endpoint
exports.userLogin = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user.id; 
  const user = await userModel.findById(userId);
  const { coupon } = req.body;
  const { _id } = req.user;
console.log();
  // Check if it's the user's first login
  if (user.isFirstTimeLogin) {
    try {
     const validCoupon = await couponModel.findOne({ name : coupon });
     
      if (!validCoupon === null) {
        throw new Error('Invalid Coupon');
      }
      
      const user = await UserM.findOne({ _id });

      let cartt = await Cart.findOne({ orderby: user._id }).populate("products.product");
  
      if (cartt) {
        const cartTotal = cartt.cartTotal;
        console.log(cartTotal);
        let totalAfterDiscount = (cartTotal - validCoupon.discount).toFixed(2);
        // let totalAfterDiscount = (cartTotal - (cartTotal * validCoupon.discount) / 100).toFixed(2);
        await Cart.findOneAndUpdate(
          { orderby: user._id },
          { totalAfterDiscount },
          { new: true }
        );
        user.isFirstTimeLogin = false;
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
      await user.save();

      res.status(200).json({
        success: true,
        message: "Welcome coupon has been applied.",
        coupon: totalAfterDiscount,
      });
    } catch (error) {
      // Handle any errors that occur during coupon creation
      res.status(500).json({
        success: false,
        message: "Error creating and applying welcome coupon.",
   
        error: error.message,
      });
    }
  } else {
    // User has already used the welcome coupon
    res.status(200).json({
      success: true,
      // usedCoupon:usedcoupon,
      message: "Welcome coupon has already been used.",
    });
  }
});
