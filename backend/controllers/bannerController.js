const bannerModel = require("../models/bannerModel");
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");
const cloudinary = require("cloudinary");
const path = require("path");


// Create Banner -- Admin
exports.createBanner = catchAsyncErrors(async (req, res, next) => {
  let images = [];
  // console.log(req.files)
  if (req.files.images === "string") {
    images.push(req.files.images);
  } else {
    images = req.files.images;
  }

  const imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const file = images[i];
    const filepath = path.resolve(__dirname, '../uploads', file.name);

    await file.mv(filepath);
    const result = await cloudinary.v2.uploader.upload(filepath, {
      folder: "banners",
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.images = imagesLinks;
  req.body.user = req.user.id;

  // const banner = await bannerModel.create(req.body);

  res.status(201).json({
    success: true,
    // banner,
  });
});

// Get All Banners
exports.getAllBanners = catchAsyncErrors(async (req, res, next) => {
  const resultPerPage = 8;
  const BannerCount = await bannerModel.countDocuments();

  const apiFeature = new ApiFeatures(bannerModel.find(), req.query)
    .search()
    .filter();

  let banners = await apiFeature.query;

  let filteredBannerCount = banners.length;

  apiFeature.pagination(resultPerPage);

  banners = await apiFeature.query;

  res.status(200).json({
    success: true,
    banners,
    BannerCount,
    resultPerPage,
    filteredBannerCount,
  });
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
  const bannerr = await bannerModel.findById(req.params.id);

  if (!bannerr) {
    return next(new ErrorHander("banner not found", 404));
  }

  // Deleting Images From Cloudinary
  for (let i = 0; i < bannerr.images.length; i++) {
    const file = bannerr.images[i];

    await cloudinary.v2.uploader.destroy(file.public_id);
  }

  await bannerr.remove();

  res.status(200).json({
    success: true,
    message: "banner Delete Successfully",
  });
});
