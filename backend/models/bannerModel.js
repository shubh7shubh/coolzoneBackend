const mongoose = require("mongoose");

const BannerSchema = mongoose.Schema({
  category: {
    type: String,
    required: [true, "Please Enter Product Category"],
  },
  offer: {
    type: String,
    required: [true, "Please Enter offer"],
    trim: true,
  },
  text: {
    type: String,
    required: [true, "Please Enter text"],
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Banner", BannerSchema);
