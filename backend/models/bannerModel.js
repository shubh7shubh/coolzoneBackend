const mongoose = require("mongoose");

const BannerSchema = mongoose.Schema({
  category: {
    type: String,
    required: [true, "Please Enter Product Category"],
  },

  bannerImages: {
    type: [{
      type: String,
    }]
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Banner", BannerSchema);
