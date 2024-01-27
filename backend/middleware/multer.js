const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
        // return cb(null, file.originalname);
        return cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const multerMiddleware = multer({
    storage,
});

module.exports = { multerMiddleware };