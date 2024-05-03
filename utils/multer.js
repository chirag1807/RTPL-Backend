const multer = require("multer");
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const path = require("path");

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


// const aws = require("aws-sdk");
// const multerS3 = require("multer-s3");

// const path = require("path");

// const s3 = new aws.S3({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   region: process.env.AWS_REGION // specify your AWS region
// });

// const storage = multerS3({
//   s3: s3,
//   bucket: process.env.S3_BUCKET_NAME, // specify your S3 bucket name
//   contentType: multerS3.AUTO_CONTENT_TYPE,
//   acl: "public-read", // specify the access control list (ACL) for the files
//   key: function(req, file, cb) {
//     const id = Date.now() + path.extname(file.originalname); // generate unique key for the file
//     cb(null, id);
//   }
// });

// const upload = multer({ storage });

// module.exports = { upload };
