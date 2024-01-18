const Product = require("../models/productModel");
const UserM = require("../models/userModel");
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");
const cloudinary = require("cloudinary");
const path = require("path");
const { log, error } = require("console");
const { privateEncrypt } = require("crypto");
const  csv = require('csvtojson')
const fs = require("fs");


// Create Product -- Admin
// exports.createProduct = catchAsyncErrors(async (req, res, next) => {
//   let images = [];
//   if (typeof req.files.images === "string") {
//     images.push(req.files.images);
//   } else {
//     images = req.files.images;
//   }

//   const imagesLinks = [];

//   for (let i = 0; i < images.length; i++) {
//     const file = images[i];
//     const filepath = path.resolve(__dirname, "../uploads", file.name);
//     await file.mv(filepath);
//     const result = await cloudinary.v2.uploader.upload(filepath, {
//       folder: "products",
//     });

//     imagesLinks.push({
//       public_id: result.public_id,
//       url: result.secure_url,
//     });
//   }

//   req.body.images = imagesLinks;
//   req.body.user = req.user.id;

//   const product = await Product.create(req.body);

//   res.status(201).json({
//     success: true,
//     product,
//   });
// });
// =============================================
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  let images = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
  const imagesLinks = [];

  for (const file of images) {
    const { path: filepath } = file;
    const result = await cloudinary.uploader.upload(filepath, { folder: "products" });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
    // fs.unlinkSync(filepath); // Delete the uploaded image from local storage
  }

  const product = await Product.create({ ...req.body, images: imagesLinks, user: req.user.id });

  res.status(201).json({
    success: true,
    product,
  });
});
// =============================================
exports.addProductsInBulk = catchAsyncErrors(async (req, res) => {
  try {
   
      var userData =[];
      
      const file = req.files.file;
      const filepath = path.resolve(__dirname, "../uploads", file.name);
     const out = await file.mv(filepath);
      
     await csv()
      .fromFile(filepath)
      .then(async(response)=>{
          // console.log(response);
          for(var x=0; x<response.length;x++){
             userData.push({
              name: response[x].name ,
              description: response[x].description ,
              brand: response[x].brand ,
              specification: response[x].specification ,
              price: response[x].price ,
              best_seller: response[x].best_seller ,
              category:response[x].category ,
              Stock:response[x].Stock,
              guarantee:response[x].guarantee,
              featured:response[x].featured,
              // user:response[x].AddedBY,

             }) 
            }
            
            // console.log("i am user data"+ JSON.stringify(userData));
         await Product.insertMany(userData)
      })
      // console.log(userData);
      res.status(201).json({
        success: true,
        message:"Excel data added to db",
        userData:userData
      });
     
  } catch (error) {
    res.status(400).json({
      success: false,
      message:error.message,
      userData
    });
  }
});



// ===============================================

// Get All Product
exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
  const resultPerPage = 8;
  const productsCount = await Product.countDocuments();

  const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter();

  let products = await apiFeature.query;

  let filteredProductsCount = products.length;

  apiFeature.pagination(resultPerPage);

  products = await apiFeature.query;

  res.status(200).json({
    success: true,
    products,
    productsCount,
    resultPerPage,
    filteredProductsCount,
  });
});

// Get All Product (Admin)
exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json({
    success: true,
    products,
  });
});
// =================================================================================
// Get all Catagory  Names
exports.getCategoriesNames = catchAsyncErrors(async (req, res, next) => {
  const categories = await Product.distinct("category");

  res.status(200).json({
    success: true,
    message: "all categories listed below",
    allCategories: categories,
  });
});
// Get Product Details
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

// // Update Product -- Admin

exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHander("Product not found", 404));
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
    for (let i = 0; i < product.images.length; i++) {
      const file = product.images[i];

      await cloudinary.v2.uploader.destroy(file.public_id);
    }

    // product.images[i].public_id--------------^
    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const file = images[i];
      const filepath = path.resolve(__dirname, "../uploads", file.name);
      await file.mv(filepath);
      const result = await cloudinary.v2.uploader.upload(filepath, {
        folder: "products",
      });
      // images[i]-----------------------------------------^
      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product,
  });
});
// ============================================

// Delete Product

exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }

  // Deleting Images From Cloudinary
  for (let i = 0; i < product.images.length; i++) {
    const file = product.images[i];

    await cloudinary.v2.uploader.destroy(file.public_id);
  }

  await product.remove();

  res.status(200).json({
    success: true,
    message: "Product Delete Successfully",
  });
});

// Create New Review or Update the review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;

  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    review: review,
  });
});

// Get All Reviews of a product
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

// =====================================================================================

// Get user own reviews and rating

exports.getUserReviews = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user._id;
  try {
    const userReviews = await Product.find({ "reviews.user": userId });
    const userReviewsCount = userReviews.length;

    if (!userReviews) {
      return next(new ErrorHander("reviews not found", 404));
    }

    res.status(200).json({
      success: true,
      usersreviews: userReviews,
      userReviewsCount,
    });
  } catch (error) {
    return next(new ErrorHander("Error fetching user reviews", 500));
  }
});

// =====================================================================================
// Delete Review
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
    message: "your product review delated Successfully",
  });
});

// add to WishList
exports.addToWishlist = catchAsyncErrors(async (req, res, next) => {
  const { _id } = req.user;
  let productId = req.params.id;

  try {
    // Find the user
    const user = await UserM.findById(_id);

    // Check if the product is already in the wishlist
    const alreadyAdded = user.wishlist.find(
      (id) => id.toString() === productId
    );

    // If the product is already in the wishlist, remove it
    if (alreadyAdded) {
      user.wishlist = user.wishlist.filter(
        (id) => id.toString() !== productId
      );
    } else {
      // Add the product to the wishlist
      user.wishlist.push(productId);
    }

    // Save the user changes
    await user.save();

    // Get all of the product details for the products in the user's wishlist
    const productDetails = await Product.find({
      _id: { $in: user.wishlist },
    });

    // Add the product details to the user object
    user.wishlistDetails = productDetails;
  
    await user.populate('wishlistDetails').execPopulate();

    // Save the user changes
    await user.save();

    // Return the updated user object
    res.json({ user });
  } catch (error) {
    throw new Error(error);
  }
});
