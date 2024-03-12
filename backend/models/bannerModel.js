const mongoose = require("mongoose");

const BannerSchema = mongoose.Schema({
  bannerImages: {
    type: [{
      bannerImage: {
        type: String,
      },
      category: {
        type: String,
        required: [true, "Please Enter Product Category"],
      },
    }],
  },
  subCategory: {
    type: String,
    required: [true, "Please enter sub category"],
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Banner", BannerSchema);
