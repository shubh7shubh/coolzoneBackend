const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({

  products:[
    {
      product:{
        type:mongoose.Schema.Types.ObjectId,  
        ref: "Product",
      },
      quantity:Number,
      price:Number,
    },
  ],
  cartTotal:Number,
  
  totalAfterDiscount:Number,

  orderby: { //user or orderby
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
 
});
cartSchema.set('timestamps', true)
module.exports = mongoose.model("Cart", cartSchema);
