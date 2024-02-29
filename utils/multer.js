const multer = require("multer");
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

const storage = multer.diskStorage({
  destination: path.join(__dirname, "../uploads"), 
  
  filename: (req, file, cb) => {

    const uniqueFilename = `${Date.now()}${path.extname(
      file.originalname,
    )}`;
    cb(null, uniqueFilename);
  },
});

const upload = multer({ storage,
    onFileUploadStart: function (file) {
        console.log(file.originalname + ' is starting ...')
    },
});

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