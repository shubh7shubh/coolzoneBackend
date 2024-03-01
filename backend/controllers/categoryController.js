const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Category = require("../models/categoryModel");




exports.addCategory = catchAsyncErrors(async (req, res, next) => {

    const { categoryName } = req.body;
    const category = await Category.create({
        categoryName: categoryName.toLowerCase(),
    })
    res.status(201).json({ success: true, message: 'Category added successfully' });
});

exports.getCategories = catchAsyncErrors(async (req, res, next) => {

    const categories = await Category.find();
    res.status(200).json({ success: true, categories });

});

exports.deleteCategory = catchAsyncErrors(async (req, res, next) => {
    const category = await Category.findById(req.params.categoryId);
    await category.deleteOne()
    res.status(200).json({ success: true, message: 'Category deleted successfully' });
});
