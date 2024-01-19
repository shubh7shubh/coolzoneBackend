const Product = require("../models/productModel")


// export type OrderItemType = {
//     name: string;
//     photo: string;
//     price: number;
//     quantity: number;
//     productId: string;
// };

const reduceStock = async (orderItems) => {
    for (let i = 0; i < orderItems.length; i++) {
        const order = orderItems[i];
        const product = await Product.findById(order.productId);
        if (!product) throw new Error("Product Not Found");
        product.stock -= order.quantity;
        await product.save();
    }
};

module.exports = reduceStock;