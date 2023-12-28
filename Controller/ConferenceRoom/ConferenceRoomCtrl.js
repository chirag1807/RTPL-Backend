const validator = require('validator');
const COMMON = require('../../Common/common');
const { createAccessToken } = require('../../Middleware/auth');
const CONSTANT = require('../../constant/constant');

const inputFieldsConferenceRoom = [
  "officeID",
  "conferenceRoomName",
  "createdBy",
  "updatedBy",
  "deletedBy",
];

module.exports.addConferenceRoom = async (req, res) => {
  try {
    const { ConferenceRoom } = req.app.locals.models;
    // get value of CreatedBy 
    // COMMON.setModelCreatedByFieldValue(req);
    // check createdBy is admin or not (means put this condition in below if condition.)
    if (req.body) {
      const conferenceRoom = await ConferenceRoom.create(req.body, {
        fields: inputFieldsConferenceRoom,
      });
      if (conferenceRoom) {
        res.status(200).json({
          message: "Your conference room has been registered successfully.",
        });
      } else {
        res.status(400).json({
          message:
            "Sorry, Your conference room has not registered. Please try again later",
        });
      }
    }
    else {
      console.log("Invalid perameter");
      res.status(400).json({ error: "Invalid perameter" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}

module.exports.getConferenceRooms = async (req, res) => {
  try {
    const { ConferenceRoom } = req.app.locals.models;

    const conferenceRooms = await ConferenceRoom.findAll({});

    if (conferenceRooms) {
      res.status(200).json({
        message: "Conference Room Fetched Successfully.",
        data: conferenceRooms,
      });
    } else {
      res.status(400).json({
        message: "Conference Rooms Can't be Fetched, Please Try Again Later.",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

module.exports.getConferenceRoomByID = async (req, res) => {
  try {
    const { ConferenceRoom } = req.app.locals.models;
    if (req.params) {
      const { conferenceRoomID } = req.params;
      const conferenceRoom = await ConferenceRoom.findOne({
        where: { conferenceRoomID },
      });

      if (conferenceRoom) {
        res.status(200).json({
          message: "Conference Room Fetched Successfully.",
          data: conferenceRoom,
        });
      } else {
        res.status(400).json({
          message: "Conference Room Can't be Fetched, Please Try Again Later.",
        });
      }
    }
    else {
      console.log("Invalid perameter");
      res.status(400).json({ error: "Invalid perameter" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

module.exports.getConferenceRoomByOfficeID = async (req, res) => {
  try {
    const { ConferenceRoom } = req.app.locals.models;
    if (req.params) {
      const { officeID } = req.params;
      const conferenceRooms = await ConferenceRoom.findOne({
        where: { officeID },
      });

      if (conferenceRooms) {
        res.status(200).json({
          message: "Conference Rooms Fetched Successfully.",
          data: conferenceRooms,
        });
      } else {
        res.status(400).json({
          message: "Conference Rooms Can't be Fetched, Please Try Again Later.",
        });
      }
    }
    else {
      console.log("Invalid perameter");
      res.status(400).json({ error: "Invalid perameter" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

module.exports.updateConferenceRoom = async (req, res) => {
  try {
    const { ConferenceRoom } = req.app.locals.models;
    // get value of updatedBy
    // COMMON.setModelUpdatedByFieldValue(req);
    if (req.params && req.body) {
      const { conferenceRoomID } = req.params;

      const conferenceRoom = await ConferenceRoom.findByPk(conferenceRoomID);

      if (!conferenceRoom) {
        return res.status(404).json({ error: 'Conference room not found for the given ID' });
      }

      const updatedConferenceRoom = await ConferenceRoom.update(req.body, {
        fields: inputFieldsConferenceRoom,
      });

      if (updatedConferenceRoom) {
        res.status(200).json({ message: "Conference Room has been Updated Successfully." });
      }
      else {
        res.status(400).json({ message: "Conference Room has not been Updated, Please Try Again Later." });
      }
    }
    else {
      console.log("Invalid perameter");
      res.status(400).json({ error: "Invalid perameter" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

module.exports.deleteConferenceRoom = async (req, res) => {
  try {
    const { ConferenceRoom } = req.app.locals.models;
    // get value of deletedBy
    // COMMON.setModelDeletedByFieldValue(req);
    if (req.params) {
      const { conferenceRoomID } = req.params;

      const conferenceRoom = await ConferenceRoom.findByPk(conferenceRoomID);

      if (!conferenceRoom) {
        return res.status(404).json({ error: 'Conference room not found for the given ID' });
      }

      const deletedConferenceRoom = await conferenceRoom.destroy();

      if (deletedConferenceRoom) {
        res.status(200).json({ message: "Conference room has been Deleted Successfully." });
      }
      else {
        res.status(400).json({ message: "Conference room has not been Deleted, Please Try Again Later." });
      }
    }
    else {
      console.log("Invalid perameter");
      res.status(400).json({ error: "Invalid perameter" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}