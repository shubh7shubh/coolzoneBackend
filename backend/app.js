const multer = require('multer');
const bodyParser = require('body-parser')
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
// const fileUpload = require("express-fileupload");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv").config();


const errorMiddleware = require("./middleware/error");

// Config
// if (process.env.NODE_ENV !== "PRODUCTION") {
//   require("dotenv").config({ path: "backend/config/config.env" });
// }

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use(fileUpload());

// Route Imports
const product = require("./routes/productRoute");
const user = require("./routes/userRoute");
const order = require("./routes/orderRoute");
const payment = require("./routes/paymentRoute");
const banner = require("./routes/bannerRoute");
const coupon = require("./routes/couponRoute");
// const cart = require("./routes/cartRoute");
const membership = require("./routes/membershipRoute");
const Address = require("./routes/addressRoute");
const Category = require("./routes/categoryRoute");
const Brand = require("./routes/brandRoute");


app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use("/api/v1", payment);
app.use("/api/v1", banner);
app.use("/api/v1", coupon);
// app.use("/api/v1", cart);
app.use("/api/v1", membership);
app.use("/api/v1", Address);
app.use("/api/v1", Category);
app.use("/api/v1", Brand);



// Add necessary middleware 
// app.use(bodyParser.json({
//   type: ["application/x-www-form-urlencoded", "application/json"], // Support json encoded bodies
// }));
// const path = require('path')

// app.use(express.static(path.resolve(__dirname, 'uploads')));

// var storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, '../uploads')
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.originalname)
//   }
// })

// var upload = multer({ storage: storage })
// app.use(upload.any());
// Middleware for Errors
app.use(errorMiddleware);

module.exports = app;
