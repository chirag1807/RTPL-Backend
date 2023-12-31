const inputFieldsDesignation = [
    "designation",
    "departmentID",
    "isActive",
    "isDeleted",
    "createdBy",
    "updatedBy",
    "deletedBy",
];

module.exports.addDesignation = async (req, res) => {
    try {
        const { Designation } = req.app.locals.models;
        const updatedBy = req.decodedEmpCode;
        // get value of CreatedBy 
        // COMMON.setModelCreatedByFieldValue(req);
        // check createdBy is admin or not (means put this condition in below if condition.)
        if (req.body) {
            req.body.createdBy = updatedBy;
            const designation = await Designation.create(req.body, {
                fields: inputFieldsDesignation,
            });
            if (designation) {
                res.status(200).json({
                    message: "Your designation has been registered successfully.",
                });
            } else {
                res.status(400).json({
                    message:
                        "Sorry, Your designation has not registered. Please try again later",
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

module.exports.getDesignations = async (req, res) => {
    try {
        const { Department, Designation } = req.app.locals.models;

        let { page, pageSize, sort, sortBy, searchField, isActive } = req.query;

        page = Math.max(1, parseInt(page, 10)) || 1;
        pageSize = Math.max(1, parseInt(pageSize, 10)) || 10;

        const offset = (page - 1) * pageSize;

        sort = sort ? sort.toUpperCase() : "ASC";

        const queryOptions = {
            limit: pageSize,
            offset: offset,
            include: [],
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
                [Op.or]: [{ designation: { [Op.like]: `%${searchField}%` } }],
            };
        }

        queryOptions.include.push({
            model: Department,
            as: "department"
        });

        queryOptions.where = { ...queryOptions.where, isActive: isActive ? isActive : true };

        const designations = await Designation.findAll(queryOptions);

        if (designations) {
            res.status(200).json({
                message: "Designations Fetched Successfully.",
                designations: designations,
            });
        } else {
            res.status(400).json({
                message: "Designations Can't be Fetched, Please Try Again Later.",
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

module.exports.getDesignationByID = async (req, res) => {
    try {
        const { Designation, Department } = req.app.locals.models;
        if (req.params) {
            const { designationID } = req.params;
            const designation = await Designation.findOne({
                where: {
                    designationID,
                    // isActive: true
                },
                include: [
                    { model: Department, as: "department" },
                ]
            });

            if (designation) {
                res.status(200).json({
                    message: "Designation Fetched Successfully.",
                    designation: designation,
                });
            } else {
                res.status(400).json({
                    message: "Designation Can't be Fetched, Please Try Again Later.",
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

module.exports.updateDesignation = async (req, res) => {
    try {
        const { Designation } = req.app.locals.models;
        const updatedBy = req.decodedEmpCode;
        // get value of updatedBy
        // COMMON.setModelUpdatedByFieldValue(req);
        if (req.params && req.body) {
            const { designationID } = req.params;

            const designation = await Designation.findByPk(designationID);

            if (!designation) {
                return res.status(404).json({ error: 'Designation not found for the given ID' });
            }
            req.body.updatedBy = updatedBy;
            const updatedDesignation = await Designation.update(req.body, {
                where: { designationID },
                fields: inputFieldsDesignation,
            });

            if (updatedDesignation) {
                res.status(200).json({ message: "Designation has been Updated Successfully." });
            }
            else {
                res.status(400).json({ message: "Designation has not been Updated, Please Try Again Later." });
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

module.exports.deleteDesignation = async (req, res) => {
    try {
        const { Designation } = req.app.locals.models;
        const updatedBy = req.decodedEmpCode;
        // get value of deletedBy
        // COMMON.setModelDeletedByFieldValue(req);
        if (req.params) {
            const { designationID } = req.params;

            const designation = await Designation.findByPk(designationID);

            if (!designation) {
                return res.status(404).json({ error: 'Designation not found for the given ID' });
            }

            const updatedDesignation = await designation.update({ deletedBy: updatedBy, isDeleted: true, isActive: false });
            if (updatedDesignation) {
                const deletedDesignation = await designation.destroy();

                if (deletedDesignation) {
                    res.status(200).json({ message: "Designation has been Deleted Successfully." });
                }
                else {
                    res.status(400).json({ message: "Designation has not been Deleted, Please Try Again Later." });
                }
            } else {
                res.status(400).json({ message: "Designation has not been Deleted, Please Try Again Later." });
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