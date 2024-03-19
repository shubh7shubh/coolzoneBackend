
const mongoose = require("mongoose");


const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
)




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
      // trim: true,
    },
    subCategory: {
      type: String,
      required: [true, "Please enter sub category"],
      // trim: true,
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

    reviews: [reviewSchema],
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
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