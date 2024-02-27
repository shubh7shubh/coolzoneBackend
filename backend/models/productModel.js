// const mongoose = require("mongoose");

// const productSchema = mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, "Please Enter product Name"],
//     trim: true,
//   },
//   shortDescription: {
//     type: String,
//     required: true,  
//   },
//   description: {
//     type: String,
//     required: [true, "Please Enter product Description"],
//   },
//   brand: {
//     type: String,
//     required: [true, "Please Enter product brand"],
//   },
//   specification: {
//     type: String,
//     required: [true, "Please Enter product specification"],
//   },
//   price: {
//     type: Number,
//     required: [true, "Please Enter selling  product Price"],
//     maxLength: [8, "Price cannot exceed 8 characters"],
//   },
//   costPrice: {
//     type: Number,
//     required: [true, "Please Enter  product cost Price"],
//     maxLength: [8, "Price cannot exceed 8 characters"],
//   },
//   Discount:{
//   type:Boolean,
//   required: [true, "Please Enter discount "],
//   default: false,
//   },
//   returnPolicy:{
//   type:Boolean,
//   required: [true, "Please Enter returnPolicy "],
//   default: "No returns allowed",

//   },
//   featured:{
//   type:Boolean,
//   required: [true, "Please Enter product featured"]
//   },
//   best_seller:{
//   type:Boolean,
//   required: [true, "Please Enter product best_seller"]
//   },
//   ratings: {
//     type: Number,
//     default: 0,
//   },
//   images: [
//     {
//       public_id: {
//         type: String,
//         required: true,
//       },
//       url: {
//         type: String,
//         required: true,
//       },
//     },
//   ],
//   category: {
//     type: String,
//     required: [true, "Please Enter Product Category"],
//   },
//   Stock: {
//     type: Number,
//     required: [true, "Please Enter product Stock"],
//     maxLength: [4, "Stock cannot exceed 4 characters"],
//     default: 1,
//   },
//   numOfReviews: {
//     type: Number,
//     default: 0,
//   },
//   guarantee:{
//     type:String
//   },
//   reviews: [
//     {
//       user: {
//         type: mongoose.Schema.ObjectId,
//         ref: "User",
//         required: true,
//       },
//       name: {
//         type: String,
//         required: true,
//       },
//       rating: {
//         type: Number,
//         required: true,
//       },
//       comment: {
//         type: String,
//         required: true,
//       },
//     },
//   ],

//   user: {
//     type: mongoose.Schema.ObjectId,
//     ref: "User",
//     // required: true,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// module.exports = mongoose.model("Product", productSchema);


// import mongoose from "mongoose";
const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter Name"],
    },
    price: {
      type: Number,
      required: [true, "Please enter Price"],
    },
    mrp: {
      type: Number,
      required: [true, "Please enter MRP"],
    },
    stock: {
      type: Number,
      required: [true, "Please enter Stock"],
    },
    brand: {
      type: String,
      required: [true, "Please enter Brand"],
    },
    warrantyPeriod: {
      type: String,
      required: [true, "Please enter Warranty Period"],
    },
    category: {
      type: String,
      required: [true, "Please enter Category"],
      trim: true,
    },
    subCategory: {
      type: String,
      required: [true, "Please enter sub category"],
      trim: true,
    },
    productImages: {
      type: [{
        type: String, // Assuming that the productImages will be stored as strings (Cloudinary links)
      }],
      validate: {
        validator: function (images) {
          return images.length <= 6;
        },
        message: "A product can have at most 6 images.",
      },
    },
    description: {
      type: String,
      required: [true, "Please Enter product Description"],
    },
    specification: {
      type: String,
      required: [true, "Please Enter product specification"],
    },
    // returnPolicy: {
    //   type: Boolean,
    //   required: [true, "Please Enter returnPolicy "],
    //   default: "No returns allowed",

    // },
    featured: {
      type: Boolean,
      required: [true, "Please Enter product featured"]
    },
    bestSeller: {
      type: Boolean,
      required: [true, "Please Enter product best_seller"]
    },


  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);

// export const Product = mongoose.model("Product", schema);

// photo: {
//   type: String,
//   required: [true, "Please enter Photo"],
// },