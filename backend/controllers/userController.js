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
const otpModel = require('../models/otpModel');
const axios = require('axios')
const OTP_EXPIRATION_TIME = 10 * 60 * 1000; // 10 minutes in milliseconds

//********************* Register a User *********************//
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

//*********************OTP REGISTER USER********************** */

exports.otpRegister = catchAsyncErrors(async (req, res, next) => {
  try {

    const { mobileNo } = req.body;

    if (!mobileNo) {
      return res.status(400).json({ message: "Enter Mobile no" });
    }


    const min = 1000;
    const max = 9999;
    const OTP = Math.floor(Math.random() * (max - min + 1)) + min;
    // console.log(OTP);
    const key = process.env.OTP_KEY
    const apiResponse = await axios.get(
      `https://www.fast2sms.com/dev/bulkV2?authorization=${key}&route=otp&variables_values=${OTP}&flash=0&numbers=${mobileNo}`
    );


    if (apiResponse.data.message === "Invalid Numbers") {
      return res.status(400).send({ message: "Invalid Numbers! Enter  Correct Number" });
    }

    const otp = await otpModel({
      mobileNo: mobileNo,
      otp: OTP,
    });

    await otp.save();
    res.status(200).send({ message: "Otp send successfully!", mobileNo: mobileNo })

  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .send({ status: false, message: err.message })
  }
})

//**********************VERIFY OTP SIGNUP/Register************************ */

exports.verifyOtpRegister = catchAsyncErrors(async (req, res, next) => {
  try {

    const { name, mobileNo, referral, otp } = req.body;

    const otpHolder = await otpModel.find({
      mobileNo: mobileNo,
    });

    // const userData = await User.findOne({
    //   mobileNo: mobileNo,
    // });


    // if (!userData) {

    // if (!otpHolder || otpHolder.otp !== otp) {
    //   return res.status(400).send({ success: false, message: "Enter Correct OTP!" });
    // }

    // const mobileLength = otpHolder.length;

    // if (!(otpHolder[mobileLength - 1]?.otp == otp)) {
    //   return res.status(400).send({ success: false, message: "Enter Correct OTP!" });
    // }

    // Early return for invalid or expired OTP
    if (!otpHolder || otpHolder.otp !== otp || otpHolder.createdAt < new Date(new Date() - 5 * 60 * 1000)) {
      console.error("Invalid OTP or OTP expired");
      console.log("Received OTP:", otp);

      return res.status(400).send("Invalid OTP or OTP expired");
    }


    const newUser = new User({ name, mobileNo });


    const result = await newUser.save();

    // console.log(result)

    // if (referral) {
    //   const userRef = await User.findOne({ _id: referral });
    //   if (userRef) {
    //     const count = userRef?.referralCount + 50;
    //     userRef.referralCount = count;
    //     await userRef?.save();

    //     const count2 = User?.referralCount + 25;
    //     User.referralCount = count2;
    //     await User?.save();
    //   }
    // }

    // const token = jwt.sign(
    //   {
    //     id: result._id,
    //   },
    //   process.env.JWT_SECRET,
    //   {
    //     expiresIn: "7d",
    //   }
    // );

    // const OTPDelete = await otpModel.deleteMany({
    //   mobileNo: mobileNo,
    // });

    // return res.status(200).send({
    //   message: "User Registration Successful!",
    //   token: token,
    //   data: result,
    // });

    sendToken(result, 200, res);

    // } else {
    //   // if (!otpHolder || otpHolder.otp !== otp) {
    //   //   return res.status(400).send({ success: false, message: "Enter Correct OTP!" });
    //   // }
    //   const mobileLength = otpHolder.length;

    //   if (!(otpHolder[mobileLength - 1]?.otp == otp)) {
    //     return res.status(400).send({ success: false, message: "Enter Correct OTP!" });
    //   }

    //   // const token = jwt.sign(
    //   //   {
    //   //     id: user._id,
    //   //   },
    //   //   process.env.JWT_SECRET,
    //   //   {
    //   //     expiresIn: "7d",
    //   //   }
    //   // );

    //   const OTPDelete = await otpModel.deleteMany({
    //     mobileNo: mobileNo,
    //   });

    //   // return res.status(200).send({
    //   //   message: "User Verify Successful!",
    //   //   token: token,
    //   //   data: user,
    //   // });
    //   sendToken(userData, 200, res);
    // }
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: err.message })
  }

});






//********************* */ Login User *************************
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


// Login User Using MobileNumber
exports.otpLogin = catchAsyncErrors(async (req, res, next) => {
  try {

    const { mobileNo } = req.body;

    if (!mobileNo) {
      return res.status(400).json({ message: "Enter Mobile Number" });
    }

    const user = await User.findOne({
      mobileNo: mobileNo,
    });

    if (!user) {
      return res.status(400).send({ message: "mobile number not registered!" });
    }

    const min = 1000;
    const max = 9999;
    const OTP = Math.floor(Math.random() * (max - min + 1)) + min;
    // console.log(OTP);
    const key = process.env.OTP_KEY
    const apiResponse = await axios.get(
      `https://www.fast2sms.com/dev/bulkV2?authorization=${key}&route=otp&variables_values=${OTP}&flash=0&numbers=${mobileNo}`
    );
    // console.log(apiResponse.data);

    if (apiResponse.data.message === "Invalid Numbers") {
      return res.status(400).send({ message: "Invalid Numbers! Enter  Correct Number" });
    }

    const otp = await otpModel({
      mobileNo: mobileNo,
      otp: OTP,

    });

    // sendToken(user, 200, res);

    await otp.save();
    res.status(200).send({ message: "Otp send successfully!", mobileNo: mobileNo, OTP: OTP });

  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: err.message })
  }
});


// Verify Login Otp
exports.verifyOpt = catchAsyncErrors(async (req, res, next) => {
  try {
    const { mobileNo, otp, notificationToken } = req.body;

    const otpHolder = await otpModel.find({ mobileNo })
    // .sort({ createdAt: -1 })
    // .limit(1);

    const user = await User.findOne({ mobileNo });

    if (!user) {
      return res.status(400).send({
        success: false,
        message: "Mobile number not registered"
      });
    }

    // const userId = user._id.toString();

    // const mobileLength = otpHolder.length;

    // if (!(otpHolder[mobileLength - 1]?.otp == otp)) {
    //   return res.status(400).send({ success: false, message: "Enter Correct OTP!" });
    // }

    const rightOtpFind = otpHolder[otpHolder.length - 1];
    if (rightOtpFind.mobileNo === mobileNo && rightOtpFind.otp === otp) {
      const currentTimestamp = new Date().getTime();
      if (currentTimestamp > rightOtpFind.timestamp + OTP_EXPIRATION_TIME) {
        return res.status(400).send("OTP has expired. Please request a new one.");
      }

      // if (otpHolder.length === 0 || otpHolder[0].otp !== otp) {
      //   return res.status(400).send({
      //     success: false,
      //     message: "Enter correct OTP!"
      //   });
      // }

      // if (otpHolder[0].mobileNo !== mobileNo) {
      //   return res.status(400).send({
      //     success: false,
      //     message: "Invalid OTP!"
      //   });
      // }

      // const token = jwt.sign(
      //   { id: userId }, 
      //   process.env.JWT_SECRET, 
      //   { expiresIn: "7d" }
      //   );

      const OTPDelete = await otpModel.deleteMany({
        mobileNo: rightOtpFind.mobileNo,
      });

      // // Update user's notificationToken
      // user.notificationToken = notificationToken;
      // await user.save();

      // return res.status(200).send({
      //     message: "User logged in successfully!",
      //     token: token,
      //     data: user,
      // });

      sendToken(user, 200, res);
    } else {
      return res.status(400).send("Enter Correct OTP!");
    }

  } catch (err) {
    return res.status(500).send({
      success: false,
      message: err.message
    });
  }
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

