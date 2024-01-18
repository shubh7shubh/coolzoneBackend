const Address = require("../models/addressModel");
const UserM = require("../models/userModel");
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");
const cloudinary = require("cloudinary");



// Add Address for User
exports.addAddress = catchAsyncErrors(async (req, res, next) => {
    const { user } = req;
    const addressData = req.body;
  
    // Create a new address
    const address = await Address.create({ ...addressData, user: user._id });
  
    // Add the address to the user's addresses array
    user.addresses.push(address);
    await user.save();
  
    res.status(201).json({
      success: true,
      data: address,
    });
  });
  
  // Get Addresses for User
  exports.getAddresses = catchAsyncErrors(async (req, res, next) => {
    const { user } = req;
  
    // Populate the addresses
    await user.populate("addresses").execPopulate();
  
    res.status(200).json({
      success: true,
      data: user.addresses,
    });
  });
  
  // Update Address for User
  exports.updateAddress = catchAsyncErrors(async (req, res, next) => {
    const { user } = req;
    const addressId = req.params.id;
    const addressData = req.body;
  
    // Find and update the address
    const address = await Address.findOneAndUpdate(
      { _id: addressId, user: user._id },
      addressData,
      { new: true, runValidators: true }
    );
  
    if (!address) {
      return next(new ErrorHander("Address not found or you don't have access to it", 404));
    }
  
    res.status(200).json({
      success: true,
      data: address,
    });
  });
  
  // Delete Address for User
  exports.deleteAddress = catchAsyncErrors(async (req, res, next) => {
    const { user } = req;
    const addressId = req.params.id;
  
    // Find and remove the address
    const address = await Address.findOneAndRemove({ _id: addressId, user: user._id });
  
    if (!address) {
      return next(new ErrorHander("Address not found or you don't have access to it", 404));
    }
  
    // Remove the reference to the address from the user's addresses array
    user.addresses = user.addresses.filter((addr) => addr.toString() !== addressId);
    await user.save();
  
    res.status(200).json({
      success: true,
      data: address,
    });
  });
  