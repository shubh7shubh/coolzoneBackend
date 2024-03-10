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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Banner", BannerSchema);
