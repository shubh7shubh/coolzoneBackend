const express = require('express');
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const Product = require("../models/productModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const path = require("path");
const cloudinary = require("cloudinary");


// Register a User
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  try {

    const { name, email, password, referral } = req.body;

    const userExist = await User.findOne({ email });

    if (!userExist) {
      const user = await User.create({
        name,
        email,
        password,
      });

      if (referral) {
        const userRef = await User.findOne({ _id: referral });
        if (userRef) {
          const count = userRef?.referralCount + 50;
          userRef.referralCount = count;
          await userRef?.save();

          const count2 = user?.referralCount + 25;
          user.referralCount = count2;
          await user?.save();
        }
      }

      sendToken(user, 201, res);
    }
    else {
      res.status(200).send({
        success: true,
        message: "Email already exists",
      });
    }

  } catch (error) {
    throw new Error(error)

  }

});




// Login User
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // checking if user has given password and email both

  if (!email || !password) {
    return next(new ErrorHander("Please Enter Email & Password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHander("Invalid email or password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHander("Invalid email or password", 401));
  }

  sendToken(user, 200, res);
});

// Logout User
exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

// Forgot Password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });


  if (!user) {
    const error = new ErrorHander("User not found", 404); // Set the statusCode
    return next(error);
  }

  // Get ResetPassword Token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/password/reset/${resetToken}`;

  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Ecommerce Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHander(error.message, 500));
  }
});

// Reset Password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  // creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHander(
        "Reset Password Token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHander("Password does not password", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});

// Get User Detail
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  // Populate the wishlist products with all details
  const productDetails = await Product.find({ _id: { $in: user.wishlist } });
  user.wishlistDetails = productDetails;

  res.status(200).json({
    success: true,
    user,
  });
});

// update User password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHander("Old password is incorrect", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHander("password does not match", 400));
  }

  user.password = req.body.newPassword;

  await user.save();

  sendToken(user, 200, res);
});

// update User Profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    lastName: req.body.lastName,
    DOB: req.body.DOB,
    contactNumber: req.body.contactNumber
  };
  // const file= req.files.avatar;
  // const filepath= path.resolve(__dirname,'../uploads',file.name);
  // await file.mv(filepath);

  // if (filepath !== "") {
  //   const user = await User.findById(req.user.id);

  //   const imageId = user.avatar.public_id;

  //   await cloudinary.v2.uploader.destroy(imageId);

  //   const myCloud = await cloudinary.v2.uploader.upload(filepath, {
  //     folder: "avatars",
  //     width: 150,
  //     crop: "scale",
  //   });

  //   newUserData.avatar = {
  //     public_id: myCloud.public_id,
  //     url: myCloud.secure_url,
  //   };
  // }

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    data: user
  });
});

// Get all users(admin)
exports.getAllUser = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});

// Get single user (admin)
exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHander(`User does not exist with Id: ${req.params.id}`)
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// update User Role -- Admin
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

// Delete User --Admin
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHander(`User does not exist with Id: ${req.params.id}`, 400)
    );
  }
  // const imageId = user.avatar.public_id;

  // await cloudinary.v2.uploader.destroy(imageId);

  await user.remove();

  res.status(200).json({
    success: true,
    message: "User Deleted Successfully",
    data: user
  });
});




// Create a new customer by admin
exports.createCustomer = catchAsyncErrors(async (req, res, next) => {
  const { name, email, mobileNo, address, landmark, State, city } = req.body;

  // Check if user with the provided email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorHander("User with this email already exists", 400));
  }

  const user = await User.create({
    name,
    email,
    mobileNo,
    address,
    password: "defaultPassword",
    landmark,
    State,
    city

    // role: "customer", // Assuming you want to set the role to customer for new users created by admin
  });

  res.status(201).json({
    success: true,
    user,
  });
});



exports.updateCustomerDetails = async (req, res, next) => {
  try {
    const customerId = req.params.customerId; // Get the customer ID from the URL params
    const updatedFields = req.body; // Get the updated fields from the request body

    // Find the customer by ID and update the details
    const user = await User.findByIdAndUpdate(customerId, updatedFields, {
      new: true, // Return the updated user document
      runValidators: true // Run model validation on the updated fields
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    res.status(200).json({
      success: true,
      user
    });

  } catch (error) {
    next(error); // Forward the error to the error handling middleware
  }
};

