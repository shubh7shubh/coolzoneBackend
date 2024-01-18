const membershipModel = require("../models/membershipModel");
const UserM = require("../models/userModel");
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");
const cloudinary = require("cloudinary");
const path = require("path");

// Create Membership -- Admin
exports.createMembership = catchAsyncErrors(async (req, res, next) => {
  //   let images = [];
  //   console.log(req.files);
  //   if ( req.files.images === "string") {
  //     images.push(req.files.images);
  //   } else {
  //     images = req.files.images;
  //   }

  //   const imagesLinks = [];

  //   for (let i = 0; i < images.length; i++) {
  //     const file= images[i];
  //     const filepath= path.resolve(__dirname,'../uploads',file.name);
  //     await file.mv(filepath);
  //     const result = await cloudinary.v2.uploader.upload(filepath, {
  //       folder: "membership",
  //     });

  //     imagesLinks.push({
  //       public_id: result.public_id,
  //       url: result.secure_url,
  //     });
  //   }

  //   req.body.images = imagesLinks;
  req.body.user = req.user.id;

  const banner = await membershipModel.create(req.body);

  res.status(201).json({
    success: true,
    banner,
  });
});

// get all membership

exports.getAlLMembershipOffers = catchAsyncErrors(async (req, res, next) => {
  const resultPerPage = 8;
  const mebershipOfferCount = await membershipModel.countDocuments();

  const apiFeature = new ApiFeatures(membershipModel.find(), req.query)
    .search()
    .filter();

  let membership = await apiFeature.query;

  let filteredMembershipOfferCount = membership.length;

  apiFeature.pagination(resultPerPage);

  banners = await apiFeature.query;

  res.status(200).json({
    success: true,
    membership,
    mebershipOfferCount,
    resultPerPage,
    filteredMembershipOfferCount,
  });
});

//   update membership offers

exports.updateMembershipOffers = catchAsyncErrors(async (req, res, next) => {
  let membershipOffer = await membershipModel.findById(req.params.id);

  if (!membershipOffer) {
    return next(new ErrorHander("Membership Offer is  not found", 404));
  }

  //     // Images Start Here
  //     let images = [];
  //   if(req.files && req.files.images){
  //     if (req.files.images.length) {
  //       images = req.files.images;
  //     } else {
  //       images.push(req.files.images);

  //     }
  //   }

  //     if (images !== undefined) {
  //       // Deleting Images From Cloudinary
  //       for (let i = 0; i < banner.images.length; i++) {
  //         const file= banner.images[i];

  //         await cloudinary.v2.uploader.destroy(file.public_id);
  //       }

  //       // banner.images[i].public_id--------------^
  //       const imagesLinks = [];

  //       for (let i = 0; i < images.length; i++) {
  //         const file= images[i];
  //         const filepath= path.resolve(__dirname,'../uploads',file.name);
  //         await file.mv(filepath);
  //         const result = await cloudinary.v2.uploader.upload(filepath, {
  //           folder: "banners",
  //         });
  //         // images[i]-----------------------------------------^
  //         imagesLinks.push({
  //           public_id: result.public_id,
  //           url: result.secure_url,
  //         });
  //       }

  //       req.body.images = imagesLinks;
  //     }

  membershipOffer = await membershipModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
    membershipOffer,
  });
});

// Delete membership Offers 

exports.deleteMembershipOffers = catchAsyncErrors(async (req, res, next) => {
    const membership = await membershipModel.findById(req.params.id);
  
    if (!membership) {
      return next(new ErrorHander("banner not found", 404));
    }
  
    // // Deleting Images From Cloudinary
    // for (let i = 0; i < membership.images.length; i++) {
    //   const file= membership.images[i];
   
    //   await cloudinary.v2.uploader.destroy(file.public_id);
    // }
  
    await membership.remove();
  
    res.status(200).json({
      success: true,
      message: "banner Delete Successfully",
    });
  });

  // ===============================================================================================
  // add to user_Membership
  exports.addMembership = catchAsyncErrors(async (req, res, next) => {
    const { _id } = req.user;
    let membershipId = req.params.id;
    try {
      // Find the user
      const user = await UserM.findById(_id);
      // console.log(user);
      // Check if the product is already in the user's membership 
      const alreadyAdded = user.user_Membership.find((id) => id.toString() === membershipId);
      
      // If the membership plan is already in the user's membership, remove it
      if (alreadyAdded) {
        // console.log("i am in if statatement ");
         res.json({message:"You already have a membership!"});
         return;
      } else {
        // console.log("i am in else block");
        // Add the membership plan to the user's membership
        user.user_Membership.push(membershipId);
      }
     
      // Save the user changes
      await user.save();
     
  
      // Return the updated user object
      res.json(user);
    } catch (error) {
      throw new Error(error);
    }
  });

  // ===========================================================================================
  
  // add membership  products items acc

  // exports.addProductToMemberShip = catchAsyncErrors(async (req, res, next) => {
  //   const { _id } = req.user;
     
  //   try {
  //     // Find the user
  //     const user = await UserM.findById(_id);
  //     console.log(user);
  //     const membershipDetails = await membershipModel.find(user.user_Membership[0]);
      
  //     const itemsForMembership = membershipDetails[0].items;
 
  //     if(Number(req.body.length) <= Number(itemsForMembership)){
  //       console.log("i am in if block");
  //       user.user_Membership_product = req.body;
  //       console.log(user);
  //       await user.save();
  //       res.status(200).json(
  //         {
  //           message:"you have Successfully addded items "
  //         });
  //     }else{
  //       res.status(200).json({
  //         success: false,
  //         message:"Sorry you exceeded your limit! You cannot add more than " + itemsForMembership + " products."
  //       });
  //     }
      
  //     res.status(500).json(user);
  //   } catch (error) {
  //     // throw new Error(error);
  //   }
  // });


  exports.addProductToMemberShip = catchAsyncErrors(async (req, res, next) => {
    const { _id } = req.user;
  
    try {
      // Find the user
      const user = await UserM.findById(_id);
      // console.log(user);
      const membershipDetails = await membershipModel.find(user.user_Membership[0]);
  
      const itemsForMembership = membershipDetails[0].items;
      const allItems = Number(req.body.length) + Number(user.user_Membership_product.length);
      console.log(allItems);
      if (allItems <= Number(itemsForMembership)) {
        console.log("I am in if block");
        for(let i=0;i<req.body.length;i++){
          user.user_Membership_product.push(req.body[i]); // Use push to add the new product to the array
        }
        console.log(user);
        await user.save();
        return res.status(200).json({
          message: "You have successfully added items."
        });
      } else {
        return res.status(200).json({
          success: false,
          message: "Sorry, you exceeded your limit! You cannot add more than " + itemsForMembership + " products."
        });
      }
    } catch (error) {
      console.error("Error adding product:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });
  

  // membership list
  exports.getMembershipList = catchAsyncErrors(async (req, res, next) => {
    // Aggregate pipeline to fetch membership list with user details
    const membershipListWithUserDetails = await UserM.aggregate([
      {
        $lookup: {
          from: 'memberships', 
          localField: 'user_Membership',
          foreignField: '_id',
          as: 'membershipDetails',
        },
      },
      {
        $unwind: '$membershipDetails',
      },
      {
        $project: {
          username: '$name',
          email: '$email',
          phone: '$contactNumber',
          city: '$City',
          membershipType: '$membershipDetails.memb_name',
          isActiveMembership: {
            $cond: {
              if: { $eq: ['$membershipDetails.status', 'Active'] }, 
              then: true,
              else: false,
            },
          },
        },
      }
    ]);
  
    res.status(200).json({
      success: true,
      data: membershipListWithUserDetails,
    });
  });


  // save products in membership 
  exports.createProductMembership = async (req, res) => {
    try {
        const { BronzeMembership, SilverMembership, GoldenMembership } = req.body;

        const newMembership = new membershipModel({
            BronzeMembership,
            SilverMembership,
            GoldenMembership
        });

        const savedMembership = await newMembership.save();

        res.status(201).json({ success: true, data: savedMembership });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Edit Product membership
exports.updateMembershipItem = async (req, res) => {
  try {
      const { membershipId, category, item, value } = req.body;

      let updateQuery = {};
      updateQuery[`${category}.${item}`] = value;

      const updatedMembership = await membershipModel.findByIdAndUpdate(
          membershipId,
          { $set: updateQuery },
          { new: true }
      );

      if (!updatedMembership) {
          return res.status(404).json({ success: false, message: 'Membership not found' });
      }

      res.status(200).json({ success: true, data: updatedMembership });
  } catch (error) {
      res.status(500).json({ success: false, message: error.message });
  }
};



// In your membership controller file


// Get member details by ID
exports.getMemberDetails = catchAsyncErrors(async (req, res, next) => {
  const memberId = req.params.id; // Assuming the ID is passed as a URL parameter

  // Query the database to fetch member details
  const memberDetails = await UserM.findById(memberId).populate('user_Membership').exec();

  if (!memberDetails) {
    return res.status(404).json({ success: false, message: 'Member not found' });
  }

  // Extract required details from the member object
  const {
    name: username,
    email: userEmail,
    contactNumber: userPhone,
    user_Membership: membershipDetails,
  } = memberDetails;

  // Extract membership type and selected services with SKU IDs
  const { memb_name: membershipType, ...selectedServices } = membershipDetails;

  // Send the formatted response
  res.status(200).json({
    success: true,
    data: {
      username,
      userEmail,
      userPhone,
      membershipType,
      selectedServices,
    },
  });
});
