const express = require ("express");
const user = express();

// Multer section
const multer = require('multer');
const path = require('path')
const bodyParser = require('body-parser')

// user.use(bodyParser.urlencoded({extended:true}))
// user.use(express.static(path.resolve(__dirname,'public')));

var storage = multer.diskStorage({
    destination:(req,file,cb)=>{
       cb(null,'./public/uploads')
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    }
})

var upload = multer ({storage:storage})
// end  multer section 


const userController = require('../controllers/BulkProducts')

user.post('/importUser',upload.single('file'),userController.importUser);
user.get('/getimported',userController.getImportedData);

module.exports =user

