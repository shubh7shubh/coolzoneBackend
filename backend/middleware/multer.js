const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
        return cb(null, file.originalname);
    }
});

const multerMiddleware = multer({
    storage,
});

module.exports = { multerMiddleware };