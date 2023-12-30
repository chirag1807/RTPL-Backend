const bcrypt = require('bcrypt')
const CONSTANT = require('../constant/constant');



const COMMON = Object.freeze({

    ENCRYPT: async(plainPassword) => {
      return await bcrypt.hash(plainPassword, CONSTANT.BCRYPT.SALTROUNDS);
      
    },
    DECRYPT: async (currentPassword,dbPassword) => {
      return await bcrypt.compare(currentPassword,dbPassword);
    },
    getCurrentUTC: () => {
      return new Date().toUTCString();
  },
  setModelCreatedByFieldValue: (req) => {
    if (req && req.body && req.user) {
        (req.body || req)["createdBy"] = req.user.empId;
        (req.body || req)["createdAt"] = COMMON.getCurrentUTC();
    }
},
setModelUpdatedByFieldValue: (req) => {
  if (req && req.body && req.user) {
      (req.body || req)["updatedBy"] = req.user.empId;
      (req.body || req)["updatedAt"] = COMMON.getCurrentUTC();
  }
}



// bcrypt.hash(plainPassword, saltRounds, (err, hashedPassword) => {
//   if (err) {
//     console.error('Error hashing password:', err);
//   } else {
//     console.log('Hashed password:', hashedPassword);
//     // Store the hashed password in your database or wherever you need to save it
//   }
// });


});

module.exports = COMMON;