const inputFieldsEmployeeRole = [
    "role",
    "isActive",
    "isDeleted",
    "createdBy",
    "updatedBy",
    "deletedBy",
];

module.exports.addEmployeeRole = async (req, res) => {
    try {
        const { EmployeeRole } = req.app.locals.models;
        const updatedBy = req.decodedEmpCode;
        // get value of CreatedBy 
        // COMMON.setModelCreatedByFieldValue(req);
        // check createdBy is admin or not (means put this condition in below if condition.)
        if (req.body) {
            req.body.createdBy = updatedBy
            const employeeRole = await EmployeeRole.create(req.body, {
                fields: inputFieldsEmployeeRole,
            });
            if (employeeRole) {
                res.status(200).json({
                    message: "Employee Role has been registered successfully.",
                });
            } else {
                res.status(400).json({
                    message:
                        "Sorry, Employee Role has not registered. Please try again later",
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

module.exports.getEmployeeRoles = async (req, res) => {
    try {
        const { EmployeeRole } = req.app.locals.models;

        let { page, pageSize, sort, sortBy, searchField, isActive } = req.query;

    page = Math.max(1, parseInt(page, 10)) || 1;
    pageSize = Math.max(1, parseInt(pageSize, 10)) || 10;

    const offset = (page - 1) * pageSize;

    // Ensure sortOrder is either 'ASC' or 'DESC', default to 'ASC' if undefined
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
        [Op.or]: [{ role: { [Op.like]: `%${searchField}%` } }],
      };
    }

    queryOptions.where = { ...queryOptions.where, isActive: isActive ? isActive : true };

    const employeeRoles = await EmployeeRole.findAll(queryOptions);

        if (employeeRoles) {
            res.status(200).json({
                message: "Employee Roles Fetched Successfully.",
                employeeRoles: employeeRoles,
            });
        } else {
            res.status(400).json({
                message: "Employee Roles Can't be Fetched, Please Try Again Later.",
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

module.exports.getEmployeeRoleByID = async (req, res) => {
    try {
        const { EmployeeRole } = req.app.locals.models;
        if (req.params) {
            const { roleID } = req.params;
            console.log(req.params);
            const employeeRole = await EmployeeRole.findOne({
                where: { 
                    roleID,
                    // isActive: true,
                },
            });

            if (employeeRole) {
                res.status(200).json({
                    message: "Employee Role Fetched Successfully.",
                    employeeRole: employeeRole,
                });
            } else {
                res.status(400).json({
                    message: "Employee Role Can't be Fetched, Please Try Again Later.",
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

module.exports.updateEmployeeRole = async (req, res) => {
    try {
        const { EmployeeRole } = req.app.locals.models;
        const updatedBy = req.decodedEmpCode;
        // get value of updatedBy
        // COMMON.setModelUpdatedByFieldValue(req);
        if (req.params && req.body) {
            const { roleID } = req.params;
            req.body.updatedBy = updatedBy;

            const employeeRole = await EmployeeRole.findByPk(roleID);

            if (!employeeRole) {
                return res.status(404).json({ error: 'EmployeeR ole not found for the given ID' });
            }

            const updatedEmployeeRole = await employeeRole.update(req.body, {
                fields: inputFieldsEmployeeRole,
            });

            if (updatedEmployeeRole) {
                res.status(200).json({ message: "Employee Role has been Updated Successfully." });
            }
            else {
                res.status(400).json({ message: "Employee Role has not been Updated, Please Try Again Later." });
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

module.exports.deleteEmployeeRole = async (req, res) => {
    try {
        const { EmployeeRole } = req.app.locals.models;
        // get value of deletedBy
        // COMMON.setModelDeletedByFieldValue(req);
        const updatedBy = req.decodedEmpCode;
        if (req.params) {
            const { roleID } = req.params;

            const employeeRole = await EmployeeRole.findByPk(roleID);

            if (!employeeRole) {
                return res.status(404).json({ error: 'Employee Role not found for the given ID' });
            }

            const updatedEmployeeRole = await employeeRole.update({ deletedBy: updatedBy, isDeleted: true, isActive: false });

            if (updatedEmployeeRole) {
                const deletedEmployeeRole = await employeeRole.destroy();

                if (deletedEmployeeRole) {
                    res.status(200).json({ message: "Employee Role has been Deleted Successfully." });
                }
                else {
                    res.status(400).json({ message: "Employee Role has not been Deleted, Please Try Again Later." });
                }
            } else {
                res.status(400).json({ message: "Employee Role has not been Deleted, Please Try Again Later." });
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}