const Product = require("../models/productModel");
const User = require("../models/userModel");
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");
const cloudinary = require("cloudinary");
const path = require("path");
const { log, error } = require("console");
const { privateEncrypt } = require("crypto");
const csv = require('csvtojson')
const fs = require("fs");
const { multerMiddleware } = require("../middleware/multer");
const { faker } = require('@faker-js/faker');


exports.getLatestProducts = catchAsyncErrors(async (req, res, next) => {
  let products;
  products = await Product.find({}).sort({ createdAt: -1 }).limit(10);
  return res.status(200).json({
    success: true,
    products
  })
})


exports.getAllCategories = catchAsyncErrors(async (req, res, next) => {

  let categories;
  categories = await Product.distinct("category")

  return res.status(200).json({
    success: true,
    categories
  })
})



exports.createProduct = async (req, res, next) => {
  try {
    const { name, price, stock, category } = req.body;

    console.log("req.body:", req.body); // Log the entire req.body to check text fields
    // console.log("req.files:", req.files); // Log the files received

    // const images = req.files.map((file) => ({
    //   url: `/uploads/${file.filename}`,
    // }));

    // console.log("images:", images); // Log the images array

    console.log(req.body, "sdfkljsdlk");

    const newProduct = await Product.create({
      name,
      // images,
      price,
      stock,
      category: category.toLowerCase(),
    });
    res.status(201).json({ product: newProduct });
  } catch (error) {
    console.error(error);
    // Handle the error appropriately, send an error response, etc.
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// exports.createProduct = catchAsyncErrors(async (req, res, next) => {
//   let images = Array.isArray(req.files.productImages) ? req.files.productImages : [req.files.productImages];


//   console.log(images, "images")
//   // for (const file of images) {
//   //   const { path: filepath } = file;
//   //   const result = await cloudinary.uploader.upload(filepath, { folder: "products" });
//   //   console.log(result, "result")
//   //   imagesLinks.push({
//   //     public_id: result.public_id,
//   //     url: result.secure_url,
//   //   });
//   //   // fs.unlinkSync(filepath); // Delete the uploaded image from local storage
//   // }
//   // console.log(imagesLinks, "images")
//   const { name, category, price, stock } = req.body;
//   const product = await Product.create({ name, category, price, stock, images: imagesLinks });

//   res.status(201).json({
//     success: true,
//     message: "Product created successfully"
//   });
// });
// =============================================
exports.addProductsInBulk = catchAsyncErrors(async (req, res) => {
  try {

    var userData = [];

    const file = req.files.file;
    const filepath = path.resolve(__dirname, "../uploads", file.name);
    const out = await file.mv(filepath);

    await csv()
      .fromFile(filepath)
      .then(async (response) => {
        // console.log(response);
        for (var x = 0; x < response.length; x++) {
          userData.push({
            name: response[x].name,
            description: response[x].description,
            brand: response[x].brand,
            specification: response[x].specification,
            price: response[x].price,
            best_seller: response[x].best_seller,
            category: response[x].category,
            Stock: response[x].Stock,
            guarantee: response[x].guarantee,
            featured: response[x].featured,
            // user:response[x].AddedBY,

          })
        }

        // console.log("i am user data"+ JSON.stringify(userData));
        await Product.insertMany(userData)
      })
    // console.log(userData);
    res.status(201).json({
      success: true,
      message: "Excel data added to db",
      userData: userData
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      userData
    });
  }
});



// ===============================================

// Get All Product || Search filters etc
exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
  try {

    const { category, price, search, sort } = req.query;

    const page = Number(req.query.page) || 1
    // 1,2,3,4,5,6,7,8
    // 9,10,11,12,13,14,15,16
    // 17,18,19,20,21,22,23,24
    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
    const skip = (page - 1) * limit;
    const baseQuery = {}

    if (search) {
      baseQuery.name = {
        $regex: search,
        $options: "i",
      }
    }

    if (price) {
      baseQuery.price = {
        $lte: Number(price)
      }
    }

    if (category) baseQuery.category = category;

    const productsPromise = Product.find(baseQuery)
      .sort(sort && { price: sort === "asc" ? 1 : -1 })
      .limit(limit)
      .skip(skip);

    const [products, filteredOnlyProduct] = await Promise.all([
      productsPromise,
      Product.find(baseQuery),
    ]);

    const totalPage = Math.ceil(filteredOnlyProduct.length / limit)


    return res.status(200).json({
      success: true,
      products,
      totalPage,
    });

  } catch (error) {
    throw new Error(error)
  }

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
// exports.getCategoriesNames = catchAsyncErrors(async (req, res, next) => {
//   const categories = await Product.distinct("category");

//   res.status(200).json({
//     success: true,
//     message: "all categories listed below",
//     allCategories: categories,
//   });
// });
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
  const { name, category, price, stock } = req.body;
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }

  if (name) product.name = name
  if (price) product.price = price
  if (category) product.category = category
  if (stock) product.stock = stock

  await product.save();

  return res.status(201).json({
    success: true,
    message: "Product update Successfully"
  })
});
// ============================================

// Delete Product

exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }

  await product.deleteOne()

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

  let { productId } = req.body
  console.log(productId, "id")
  try {
    // Find the user
    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // console.log(user, "user")

    // Check if the product is already in the wishlist
    const isProductInWishlist = user.wishlist.some((item) => item && item.equals(productId));

    if (isProductInWishlist) {
      return res.status(400).json({ success: false, message: 'Product already in wishlist' });
    }



    // Add the product to the wishlist
    user.wishlist.push(productId);
    await user.save();

    // Return the updated user object
    res.json({ user });
  } catch (error) {
    throw new Error(error);
  }
});


// Get user's wishlist
exports.getWishlist = async (req, res, next) => {
  try {
    const { _id } = req.user;

    // Find the user by userId
    const user = await User.findById(_id).populate({
      path: 'wishlist',
      model: 'Product',
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, wishlist: user.wishlist });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};




// const generateRandomProducts = async (count = 20) => {
//   const products = [];

//   for (let i = 0; i < count; i++) {
//     const product = {
//       name: faker.commerce.productName(),
//       // photo: "uploads\\1704992485278-macbook-459196_1280 (1).jpg",
//       price: faker.commerce.price({ min: 1500, max: 80000, dec: 0 }),
//       stock: faker.commerce.price({ min: 0, max: 100, dec: 0 }),
//       category: faker.commerce.department(),
//       createdAt: new Date(faker.date.past()),
//       updatedAt: new Date(faker.date.recent()),
//       __v: 0,
//     };

//     products.push(product);
//   }

//   await Product.create(products);

//   console.log({ succecss: true });
// };

// const deleteRandomsProducts = async (count = 10) => {
//   const products = await Product.find({}).skip(2);

//   for (let i = 0; i < products.length; i++) {
//     const product = products[i];
//     await product.deleteOne();
//   }

//   console.log({ succecss: true });
// };

// generateRandomProducts(20)


// const { name, price, stock, category } = req.body;

// // If the request includes a specific product, create that product
// if (name && price && stock && category) {
//   const newProduct = await Product.create({
//     name,
//     price,
//     stock,
//     category: category.toLowerCase(),
//   });

//   res.status(201).json({ product: newProduct });
// } else {
//   // Otherwise, generate random products
//   await generateRandomProducts(20);
//   res.status(201).json({ success: true, message: "Random products generated successfully." });
// }