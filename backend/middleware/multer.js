// const multer = require("multer");
// const path   = require("path");

// const upload = multer({

//   storage: multer.diskStorage({
//     destination: async (req, file, cb) => {
//       cb(null, path.join(__dirname, "../uploads"));
//     },
    
//     filename: function (req, file, cb) {
//       const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//       cb(
//         null,
//         file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
//       );
//     },
//   }),
//   limits:{
//     fileSize: 5 * 1024 *1024 //5mb
//   },
  
// });



// module.exports = upload;
