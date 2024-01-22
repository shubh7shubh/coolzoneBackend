const Address = require("../models/addressModel");
const User = require("../models/userModel");
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");
const cloudinary = require("cloudinary");



// // Add Address for User
// exports.addAddress = catchAsyncErrors(async (req, res, next) => {
//     const { user } = req;
//     const addressData = req.body;

//     // Create a new address
//     const address = await Address.create({ ...addressData, user: user._id });

//     // Add the address to the user's addresses array
//     user.addresses.push(address);
//     await user.save();

//     res.status(201).json({
//       success: true,
//       data: address,
//     });
//   });

//   // Get Addresses for User
//   exports.getAddresses = catchAsyncErrors(async (req, res, next) => {
//     const { user } = req;

//     // Populate the addresses
//     await user.populate("addresses").execPopulate();

//     res.status(200).json({
//       success: true,
//       data: user.addresses,
//     });
//   });

//   // Update Address for User
//   exports.updateAddress = catchAsyncErrors(async (req, res, next) => {
//     const { user } = req;
//     const addressId = req.params.id;
//     const addressData = req.body;

//     // Find and update the address
//     const address = await Address.findOneAndUpdate(
//       { _id: addressId, user: user._id },
//       addressData,
//       { new: true, runValidators: true }
//     );

//     if (!address) {
//       return next(new ErrorHander("Address not found or you don't have access to it", 404));
//     }

//     res.status(200).json({
//       success: true,
//       data: address,
//     });
//   });

//   // Delete Address for User
//   exports.deleteAddress = catchAsyncErrors(async (req, res, next) => {
//     const { user } = req;
//     const addressId = req.params.id;

//     // Find and remove the address
//     const address = await Address.findOneAndRemove({ _id: addressId, user: user._id });

//     if (!address) {
//       return next(new ErrorHander("Address not found or you don't have access to it", 404));
//     }

//     // Remove the reference to the address from the user's addresses array
//     user.addresses = user.addresses.filter((addr) => addr.toString() !== addressId);
//     await user.save();

//     res.status(200).json({
//       success: true,
//       data: address,
//     });
//   });




exports.addAddress = async (req, res, next) => {
  const { _id } = req.user;
  const addressData = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(_id)

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Add the new address to the user's myAddress array
    user.myAddress.push(addressData);

    // Save the updated user document
    await user.save();

    res.status(201).json({ success: true, message: 'Address added successfully' });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Controller function to get all addresses of a user
exports.getAllAddresses = async (req, res, next) => {
  const { _id } = req.user;

  try {
    // Find the user by ID
    const user = await User.findById(_id)

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const addresses = user.myAddress;

    res.status(200).json({ addresses });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Controller function to delete an address of a user
exports.deleteAddress = async (req, res, next) => {
  const { _id } = req.user;
  const addressId = req.params.addressId;

  try {
    // Find the user by ID
    const user = await User.findById(_id)

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Filter out the address to be deleted
    user.myAddress = user.myAddress.filter(address => address._id != addressId);

    // Save the updated user document
    await user.save();

    res.status(200).json({ message: 'Address deleted successfully', success: true });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

