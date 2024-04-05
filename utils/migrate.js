const sequelize = require("./config");
const Employee = require('../models/employee');
const Meeting = require("../models/meeting");
const Designation = require("../models/designation");
const InternalTeamSelect = require('../models/internalTeamSelect');
const ReqMeetVisitorDetails = require('../models/reqMeetVisitorDetails');
const TimeSlot = require('../models/timeSlot');
const VerifyCode = require("../models/verifyCode")
    
// (async () => {
//   try {
//     await sequelize.sync({ force: true });
//     console.log('-----------------------------');
//     console.log('Table created successfully');
//     console.log('-----------------------------');
//   } catch (error) {
//     console.error('Error creating table:', error);
//   } finally {
//     sequelize.close();
//   }
// })(); 

sequelize.sync({ force: true })
  .then(() => {
    console.log('-----------------------------');
    console.log('Table created successfully');
    console.log('-----------------------------');
    sequelize.close();
  })
  .catch((err) => {
    console.error('Error creating table:', err);
    sequelize.close();
  });