const bannerModel = require("../models/bannerModel");
// const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");
const cloudinary = require("cloudinary");
const path = require("path");
const uploadOnCloudinary = require("../utils/cloudinary");
const ErrorHandler = require("../utils/errorhander");


// Create Banner -- Admin
exports.createBanner = catchAsyncErrors(async (req, res, next) => {

  try {
    const { categories, subCategory } = req.body;

    // console.log(categories, subCategory, "categorrry")
    // Get the Cloudinary URLs for the uploaded images
    const imageUrls = await Promise.all(req.files.map(async (file) => {
      const imageUrl = await uploadOnCloudinary(file.path);
      // console.log(imageUrl, "uuuuuu")
      return imageUrl.secure_url; // Assuming you want to store the secure URL
    }));

    // const banner = await bannerModel.create({
    //   category: category.toLowerCase(),
    //   bannerImages: imageUrls
    // })

    const bannerImages = imageUrls.map((url, index) => ({
      bannerImage: url,
      category: categories[index].toLowerCase(),
    }));

    console.log(bannerImages, "banner images");
    const banner = await bannerModel.create({
      bannerImages: bannerImages,
      subCategory: subCategory.toLowerCase(),
    });

    console.log(banner, "categorrry")

    res.status(201).json({ success: true, message: "Banner images are created", banner: banner });

  } catch (error) {
    console.error(error);
    // Handle the error appropriately, send an error response, etc.
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get All Banners
exports.getAllBanners = catchAsyncErrors(async (req, res, next) => {

  try {

    const allBanner = await bannerModel.find();

    return res.status(200).json({
      success: true,
      allBanner,
    });

  } catch (error) {
    console.error(error);
    // Handle the error appropriately, send an error response, etc.
    res.status(500).json({ error: "Internal Server Error" });

  }

});

// Update Banner -- Admin

exports.updateBanneer = catchAsyncErrors(async (req, res, next) => {
  let banner = await bannerModel.findById(req.params.id);

  if (!banner) {
    return next(new ErrorHander("banner not found", 404));
  }

  // Images Start Here
  let images = [];
  if (req.files && req.files.images) {
    if (req.files.images.length) {
      images = req.files.images;
    } else {
      images.push(req.files.images);

    }
  }

  if (images !== undefined) {
    // Deleting Images From Cloudinary
    for (let i = 0; i < banner.images.length; i++) {
      const file = banner.images[i];

      await cloudinary.v2.uploader.destroy(file.public_id);
    }


    // banner.images[i].public_id--------------^
    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const file = images[i];
      const filepath = path.resolve(__dirname, '../uploads', file.name);
      await file.mv(filepath);
      const result = await cloudinary.v2.uploader.upload(filepath, {
        folder: "banners",
      });
      // images[i]-----------------------------------------^
      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
  }

  banner = await bannerModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    banner,
  });
});


// Delete bannerr

exports.deleteBanner = catchAsyncErrors(async (req, res, next) => {
  try {
    const bannerr = await bannerModel.findById(req.params.bannerId);

    if (!bannerr) {
      return next(new ErrorHandler("banner not found", 404));
    }

    await bannerr.deleteOne();

    res.status(200).json({
      success: true,
      message: "Banner delete successfully",
    });

  } catch (error) {
    console.error(error);
    // Handle the error appropriately, send an error response, etc.
    res.status(500).json({ error: "Internal Server Error" });

  }
});
