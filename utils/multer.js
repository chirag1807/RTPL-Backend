const multer = require("multer");
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
// const fs = require("fs");

// if (!fs.existsSync("./uploads")) {
//     fs.mkdirSync("./uploads");
// }

// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, "./uploads");
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.originalname);
//     },
// });
  
// var upload = multer({ storage: storage });

const path = require("path");

// const storage = multer.diskStorage({
//   destination: path.join(__dirname, "../uploads"), 
  
//   filename: (req, file, cb) => {
//     const uniqueFilename = `${Date.now()}${path.extname(
//       file.originalname,
//     )}`;
//     cb(null, uniqueFilename);
//   },
// });
cloudinary.config({
  secure:true
})
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'RTPL_DOCS',
    format: (req, file) => {
      return file.mimetype.split("/")[1]
    }, // supports promises as well
    public_id: (req, file) =>{
      const id = Date.now();
      req[file.fieldname]=req[file.fieldname]?[...req[file.fieldname],`https://res.cloudinary.com/dupko07wd/RTPL_DOCS/${id}`]:[`https://res.cloudinary.com/dupko07wd/RTPL_DOCS/${id}`]
      return id;
    },
  },
});
const upload = multer({ storage });

module.exports = { upload };

// const storage = multer.diskStorage({
//   destination:function(req,file,cb)
//   {
//       cb(null,path.join(__dirname, "../uploads"))
//   },
//   filename:function(req,file,cb) {
//       console.log(file)
//       const fileName = file.fieldname + '-' + Date.now();
//       req.fileName = req.fileName?[...req.fileName,fileName]:[fileName]
//       console.log(req.fileName)
//       cb(null,fileName)
//   }
// })