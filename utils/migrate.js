const sequelize = require("./config");
const Employee = require('../models/employee');
const Meeting = require("../models/meeting");
const Designation = require("../models/designation");
const InternalTeamSelect = require('../models/internalTeamSelect');
const ReqMeetVisitorDetails = require('../models/reqMeetVisitorDetails');
const TimeSlot = require('../models/timeSlot');
    
(async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('-----------------------------');
    console.log('Table created successfully');
    console.log('-----------------------------');
  } catch (error) {
    console.error('Error creating table:', error);
  } finally {
    sequelize.close();
  }
})();