const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const wishlistItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your Name"],
    maxLength: [30, "Name cannot exceed 30 characters"],
    minLength: [4, "Name should have more than 4 characters"],
  },

  lastName: {
    type: String,
    // required: [true, "Please Enter Your Name"],
    maxLength: [30, "Name cannot exceed 30 characters"],
    minLength: [4, "Name should have more than 4 characters"],
  },

  email: {
    type: String,
    required: [true, "Please Enter Your Email"],
    unique: true,
    validate: [validator.isEmail, "Please Enter a valid Email"],
  },
  password: {
    type: String,
    required: [true, "Please Enter Your Password"],
    minLength: [8, "Password should be greater than 8 characters"],
    select: false,
  },
  DOB: {
    type: String,
    // required: [true, "Please Enter Your Name"],
    maxLength: [30, "Name cannot exceed 30 characters"],
    minLength: [4, "Name should have more than 4 characters"],
  },

  contactNumber: {
    type: Number,
    // required: [true, "Please Enter Your Name"],
    // maxLength: [30, "Name cannot exceed 30 characters"],
    // minLength: [4, "Name should have more than 4 characters"],
  },

  mobileNo: {
    type: String,
    // required: [true, "Please Enter Your Mobile Number"],
  },

  isFirstTimeLogin: {
    type: Boolean,
    default: true
  },
  // avatar: {
  //   public_id: {
  //     type: String,
  //     required: true,
  //   },
  //   url: {
  //     type: String,
  //     required: true,
  //   },
  // },
  role: {
    type: String,
    default: "user",
  },


  addresses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address"
  }],
  personAddressName: {
    type: String,
    // required: [true, "Please Enter Your Address"],
    maxLength: [500, "Address cannot exceed 500 characters"],
  },
  address: {
    type: String,
    // required: [true, "Please Enter Your Address"],
    maxLength: [500, "Address cannot exceed 500 characters"],
  },
  landmark: {
    type: String,
    // required: [true, "Please Enter Your Address"],
    maxLength: [100, "Address cannot exceed 500 characters"],
  },
  State: {
    type: String,
    // required: [true, "Please Enter Your Address"],
    maxLength: [500, "Address cannot exceed 500 characters"],
  },
  City: {
    type: String,
    // required: [true, "Please Enter Your Address"],
    maxLength: [500, "Address cannot exceed 500 characters"],
  },
  sameCustomerAddress: {
    type: Boolean,
    // required: [true, "Please Enter Your Address"],
    default: false
  },


  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  }],



  wishlistDetails: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  }],


  user_Membership: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Membership",
    // default: "User has no Membership plan please choose any Membership Plan"
  }],
  user_Membership_product: [{ name: String, skuid: String }],

  createdAt: {
    type: Date,
    default: Date.now,
  },

  resetPasswordToken: String,
  resetPasswordExpire: Date,


});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

// JWT TOKEN
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};


// Compare Password 
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);

};


// Generating Password Reset Token
userSchema.methods.getResetPasswordToken = function () {
  // Generating Token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hashing and adding resetPasswordToken to userSchema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
