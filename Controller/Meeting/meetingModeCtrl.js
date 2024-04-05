const inputFieldsMeetingMode = [
    "meetingMode",
    "isActive",
    "isDeleted",
    "createdBy",
    "updatedBy",
    "deletedBy",
];

module.exports.addMeetingMode = async (req, res) => {
    try {
        const { MeetingMode } = req.app.locals.models;
        const updatedBy = req.decodedEmpCode;
        // get value of CreatedBy 
        // COMMON.setModelCreatedByFieldValue(req);
        // check createdBy is admin or not (means put this condition in below if condition.)
        if (req.body) {
            req.body.createdBy = updatedBy;
            const meetingMode = await MeetingMode.create(req.body, {
                fields: inputFieldsMeetingMode,
            });
            if (meetingMode) {
                res.status(200).json({
                    response_type: "SUCCESS",
                    data: {},
                    message: "Your meeting mode has been registered successfully.",
                });
            } else {
                res.status(400).json({
                    response_type: "FAILED",
                    data: {},
                    message:
                        "Sorry, Your meeting mode has not registered. Please try again later",
                });
            }
        }
        else {
            console.log("Invalid perameter");
            res.status(400).json({ 
                response_type: "FAILED",
                data: {},
                message: "Invalid perameter" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            response_type: "FAILED",
            data: {},
            message: error.message });
    }
}

module.exports.getMeetingModes = async (req, res) => {
    try {
        const { MeetingMode } = req.app.locals.models;

        let { page, pageSize, sort, sortBy, searchField, isActive } = req.query;

    page = Math.max(1, parseInt(page, 10)) || 1;
    pageSize = Math.max(1, parseInt(pageSize, 10)) || 10;

    const offset = (page - 1) * pageSize;

    sort = sort ? sort.toUpperCase() : "ASC";

    const queryOptions = {
      limit: pageSize,
      offset: offset,
    };

    if (sortBy) {
      queryOptions.order = [[sortBy, sort]];
    }

    if (
      searchField &&
      typeof searchField === "string" &&
      searchField.trim() !== ""
    ) {
      queryOptions.where = {
        [Op.or]: [{ meetingMode: { [Op.like]: `%${searchField}%` } }],
      };
    }

    queryOptions.where = { ...queryOptions.where, isActive: isActive ? isActive : true };

    const totalCount = await MeetingMode.count({
        where: queryOptions.where,
      });
    const totalPage = Math.ceil(totalCount / pageSize);

    const meetingModes = await MeetingMode.findAll(queryOptions);

        if (meetingModes) {
            res.status(200).json({
                totalPage: totalPage,
                currentPage: page,
                response_type: "SUCCESS",
                message: "Meeting Modes Fetched Successfully.",
                data: {meetings: meetingModes},
            });
        } else {
            res.status(400).json({
                response_type: "FAILED",
                data: {},
                message: "Meeting Modes Can't be Fetched, Please Try Again Later.",
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            response_type: "FAILED", 
            data: {},
            message: error.message });
    }
}

module.exports.getMeetingModeByID = async (req, res) => {
    try {
        const { MeetingMode } = req.app.locals.models;
        if (req.params) {
            const { meetingModeID } = req.params;
            console.log(req.params);
            const meetingModes = await MeetingMode.findOne({
                where: { meetingModeID,
                    // isActive: true,
                },
            });

            if (meetingModes) {
                res.status(200).json({
                    response_type: "SUCCESS",
                    message: "Meeting Mode Fetched Successfully.",
                    data: {meetings: meetingModes},
                });
            } else {
                res.status(400).json({
                    response_type: "FAILED",
                    data: {},
                    message: "Meeting Mode Can't be Fetched, Please Try Again Later.",
                });
            }
        }
        else {
            console.log("Invalid perameter");
            res.status(400).json({ 
                response_type: "FAILED",
                data: {},
                message: "Invalid perameter" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            response_type: "FAILED",
            data: {},
            message: error.message });
    }
}

module.exports.updateMeetingMode = async (req, res) => {
    try {
        const { MeetingMode } = req.app.locals.models;
        const updatedBy = req.decodedEmpCode;
        // get value of updatedBy
        // COMMON.setModelUpdatedByFieldValue(req);
        if (req.params && req.body) {
            const { meetingModeID } = req.params;
            req.body.updatedBy = updatedBy;

            const meetingMode = await MeetingMode.findByPk(meetingModeID);

            if (!meetingMode) {
                return res.status(404).json({ 
                    response_type: "FAILED",
                    data: {},
                    message: 'MeetingMode not found for the given ID' });
            }

            const updatedMeetingMode = await meetingMode.update(req.body, {
                fields: inputFieldsMeetingMode,
            });

            if (updatedMeetingMode) {
                res.status(200).json({ 
                    response_type: "SUCCESS",
                    data: {},
                    message: "Meeting Mode has been Updated Successfully." });
            }
            else {
                res.status(400).json({ 
                    response_type: "FAILED",
                    data: {},
                    message: "Meeting Mode has not been Updated, Please Try Again Later." });
            }
        }
        else {
            console.log("Invalid perameter");
            res.status(400).json({ 
                response_type: "FAILED",
                data: {},
                message: "Invalid perameter" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            response_type: "FAILED",
            data: {},
            message: error.message });
    }
}

module.exports.deleteMeetingMode = async (req, res) => {
    try {
        const { MeetingMode } = req.app.locals.models;
        const updatedBy = req.decodedEmpCode;
        // get value of deletedBy
        // COMMON.setModelDeletedByFieldValue(req);
        if (req.params) {
            const { meetingModeID } = req.params;

            const meetingMode = await MeetingMode.findByPk(meetingModeID);

            if (!meetingMode) {
                return res.status(404).json({ 
                    response_type: "FAILED",
                    data: {},
                    message: 'MeetingMode not found for the given ID' });
            }

            const updatedMeetingMode = await meetingMode.update({ deletedBy: updatedBy, isDeleted: true, isActive: false });

            if (updatedMeetingMode) {
                const deletedMeetingMode = await meetingMode.destroy();

                if (deletedMeetingMode) {
                    res.status(200).json({ 
                        response_type: "SUCCESS",
                        data: {},
                        message: "Meeting Mode has been Deleted Successfully." });
                }
                else {
                    res.status(400).json({ 
                        response_type: "FAILED",
                        data: {},
                        message: "Meeting Mode has not been Deleted, Please Try Again Later." });
                }
            } else {
                res.status(400).json({ 
                    response_type: "FAILED",
                    data: {},
                    message: "Meeting Mode has not been Deleted, Please Try Again Later." });
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            response_type: "FAILED",
            data: {},
            message: error.message });
    }
}