const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Brand = require("../models/brandModel");



exports.addBrand = catchAsyncErrors(async (req, res, next) => {

    const { brandName } = req.body;
    const brand = await Brand.create({
        brandName: brandName.toLowerCase(),
    })
    res.status(201).json({ success: true, message: 'Brand added successfully' });
});

exports.getBrands = catchAsyncErrors(async (req, res, next) => {

    const brands = await Brand.find();
    res.status(200).json({ success: true, brands });

});

exports.deleteBrand = catchAsyncErrors(async (req, res, next) => {
    const brand = await Brand.findById(req.params.brandId);
    await brand.deleteOne()
    res.status(200).json({ success: true, message: 'Brand deleted successfully' });
});
