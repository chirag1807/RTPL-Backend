const inputFieldsMeetingType = [
    "meetingType",
    "isActive",
    "isDeleted",
    "createdBy",
    "updatedBy",
    "deletedBy",
];

module.exports.addMeetingType = async (req, res) => {
    try {
        const { MeetingType } = req.app.locals.models;
        const updatedBy = req.decodedEmpCode;
        // get value of CreatedBy 
        // COMMON.setModelCreatedByFieldValue(req);
        // check createdBy is admin or not (means put this condition in below if condition.)
        if (req.body) {
            req.body.createdBy = updatedBy;
            const meetingType = await MeetingType.create(req.body, {
                fields: inputFieldsMeetingType,
            });
            if (meetingType) {
                res.status(200).json({
                    response_type: "SUCCESS",
                    data: {},
                    message: "Your meeting type has been registered successfully.",
                });
            } else {
                res.status(400).json({
                    response_type: "FAILED",
                    data: {},
                    message:
                        "Sorry, Your meeting type has not registered. Please try again later",
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

module.exports.getMeetingTypes = async (req, res) => {
    try {
        const { MeetingType } = req.app.locals.models;

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
                [Op.or]: [{ meetingType: { [Op.like]: `%${searchField}%` } }],
            };
        }

        queryOptions.where = {
            ...queryOptions.where,
            isActive: isActive ? isActive : true,
        };

        const totalCount = await MeetingType.count({
            where: queryOptions.where,
          });
        const totalPage = Math.ceil(totalCount / pageSize);

        const meetingTypes = await MeetingType.findAll(queryOptions);

        if (meetingTypes) {
            res.status(200).json({
                totalPage: totalPage,
                currentPage: page,
                response_type: "SUCCESS",
                message: "Meeting Types Fetched Successfully.",
                data: {meetings: meetingTypes},
            });
        } else {
            res.status(400).json({
                response_type: "FAILED",
                data: {},
                message: "Meeting Types Can't be Fetched, Please Try Again Later.",
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

module.exports.getMeetingTypeByID = async (req, res) => {
    try {
        const { MeetingType } = req.app.locals.models;
        if (req.params) {
            const { meetingTypeID } = req.params;
            const meetingType = await MeetingType.findOne({
                where: { meetingTypeID },
                // isActive: true,
            });

            if (meetingType) {
                res.status(200).json({
                    response_type: "SUCCESS",
                    message: "Meeting Type Fetched Successfully.",
                    data: {meeting: meetingType},
                });
            } else {
                res.status(400).json({
                    response_type: "FAILED",
                    data: {},
                    message: "Meeting Type Can't be Fetched, Please Try Again Later.",
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

module.exports.updateMeetingType = async (req, res) => {
    try {
        const { MeetingType } = req.app.locals.models;
        const updatedBy = req.decodedEmpCode;
        // get value of updatedBy
        // COMMON.setModelUpdatedByFieldValue(req);
        if (req.params && req.body) {
            const { meetingTypeID } = req.params;
            req.body.updatedBy = updatedBy;

            const meetingType = await MeetingType.findByPk(meetingTypeID);

            if (!meetingType) {
                return res
                    .status(404)
                    .json({ 
                        response_type: "FAILED",
                        data: {},
                        message: "MeetingType not found for the given ID" });
            }

            const updatedMeetingType = await meetingType.update( req.body, {
                fields: inputFieldsMeetingType,
            });

            if (updatedMeetingType) {
                res.status(200).json({ 
                    response_type: "SUCCESS",
                    data: {},
                    message: "Meeting Type has been Updated Successfully." });
            }
            else {
                res.status(400).json({ 
                    response_type: "FAILED",
                    data:{},
                    message: "Meeting Type has not been Updated, Please Try Again Later." });
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

module.exports.deleteMeetingType = async (req, res) => {
    try {
        const { MeetingType } = req.app.locals.models;
        const updatedBy = req.decodedEmpCode;
        // get value of deletedBy
        // COMMON.setModelDeletedByFieldValue(req);
        if (req.params) {
            const { meetingTypeID } = req.params;

            const meetingType = await MeetingType.findByPk(meetingTypeID);

            if (!meetingType) {
                return res
                    .status(404)
                    .json({ 
                        response_type: "FAILED",
                        data: {},
                        message: "MeetingType not found for the given ID" });
            }

            const updatedMeetingType = await meetingType.update({ deletedBy: updatedBy, isDeleted: true, isActive: false });
            if (updatedMeetingType) {
                const deletedMeetingType = await meetingType.destroy();

                if (deletedMeetingType) {
                    res.status(200).json({ 
                        response_type: "SUCCESS",
                        data: {},
                        message: "Meeting Type has been Deleted Successfully." });
                }
                else {
                    res.status(400).json({ 
                        response_type: "FAILED",
                        data: {},
                        message: "Meeting Type has not been Deleted, Please Try Again Later." });
                }
            }
            else {
                console.log("Invalid perameter");
                res.status(400).json({ 
                    response_type: "FAILED",
                    data: {},
                    message: "Invalid perameter" });
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