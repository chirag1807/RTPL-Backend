const COMMON = require("../../Common/common");
const CONSTANT = require("../../constant/constant");
const inputFieldsEmployee = [
  "firstName",
  "lastName",
  "emp_code",
  "department",
  "destination",
  "email",
  "phone",
  "company",
  "Office",
  "password",
  "isActive",
  "isDeleted",
  "createdBy",
  "updatedBy",
  "deletedBy",
  // 'roleID'
];

// update employees details
module.exports.updateEmployee = async (req, res) => {
  try {
    const { Employee } = req.app.locals.models;
    const { id } = req.params;
    const updatedBy = req.decodedEmpCode;

    const employeeExists = await Employee.findByPk(id);
    if (!employeeExists) {
      return res
        .status(404)
        .json({ error: `Employee with id ${id} not found` });
    }

    COMMON.setModelUpdatedByFieldValue(req);

    const hashedPassword = await COMMON.ENCRYPT(req.body.password);
    if (!hashedPassword) {
      return res
        .status(500)
        .json({ error: CONSTANT.MESSAGE_CONSTANT.SOMETHING_WENT_WRONG });
    }
    req.body.password = hashedPassword;

    req.body.updatedBy = updatedBy;

    await Employee.update(req.body, {
      where: { empId: id },
      fields: inputFieldsEmployee,
    });

    res.status(200).json({ message: "Employee updated successfully" });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: error.message });
  }
};

// delete employees details
module.exports.deleteEmployee = async (req, res) => {
  try {
    const { Employee } = req.app.locals.models;
    const updatedBy = req.decodedEmpCode;
    if (req.params.id) {
      const empId = req.params.id;
      const employeeDetails = await Employee.findByPk(empId);
      if (employeeDetails) {
        await employeeDetails.update({
          isDeleted: 1,
          deletedBy: updatedBy
        });
        await employeeDetails.destroy();
        // Return a success response
        res.json({ message: "Employee deleted successfully." });
      } else {
        res.status(404).json({ error: `Employee with id ${empId} not found.` });
      }
    } else {
      console.log("Invalid perameter");
      // Return an error response indicating missing data
      res.status(400).json({ error: "Invalid perameter" });
    }
  } catch (error) {
    console.error("An error occurred:", error);
    // Return an error response
    res.status(500).json({ error: error.message });
  }
};

//get All Employees
module.exports.getNonAdminEmployees = async (req, res) => {
  try {
    const { Employee, Company, Office, Department, Designation, EmployeeRole } =
      req.app.locals.models;

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
        [Op.or]: [
          { aadharNumber: { [Op.like]: `%${searchField}%` } },
          { firstName: { [Op.like]: `%${searchField}%` } },
          { lastName: { [Op.like]: `%${searchField}%` } },
          { emp_code: { [Op.like]: `%${searchField}%` } },
          { birthDate: { [Op.like]: `%${searchField}%` } },
          { joiningDate: { [Op.like]: `%${searchField}%` } },
          { email: { [Op.like]: `%${searchField}%` } },
          { phone: { [Op.like]: `%${searchField}%` } },
        ],
      };
    }

    queryOptions.include.push(
      {
        model: Company,
        as: "companyDetails",
        attributes: ["companyID", "Name", "contact", "email", "isDeleted"],
      },
      {
        model: Office,
        as: "officeDetails",
        attributes: ["officeID", "Address", "companyID", "isDeleted"],
      },
      {
        model: Department,
        as: "employeeDepartment",
        attributes: ["departmentID", "department", "isDeleted"],
      },
      {
        model: Designation,
        as: "employeeDesignation",
        attributes: ["designationID", "designation", "isDeleted"],
      },
      {
        model: EmployeeRole,
        as: "role",
        attributes: ["roleID", "role", "isDeleted"],
      }
    );

    queryOptions.where = {
      ...queryOptions.where,
      isActive: isActive ? isActive : true,
      isAdmin: false,
    };

    const nonAdminEmployees = await Employee.findAll(queryOptions);

    if (nonAdminEmployees.length === 0) {
      return res.status(404).json({ message: "No employees found" });
    }

    res.status(200).json({
      message: "Employees Fetched Successfully.",
      data: nonAdminEmployees,
    });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: error.message });
  }
};

//get Employee By Id
module.exports.getNonAdminEmployeesById = async (req, res) => {
  try {
    const { Employee, Company, Office, Department, Designation, EmployeeRole } =
      req.app.locals.models;
    const { empId } = req.params;

    const nonAdminEmployees = await Employee.findAll({
      where: {
        isAdmin: false,
        // isActive: true,
        empId: empId,
      },
      include: [
        {
          model: Company,
          as: "companyDetails",
          attributes: ["companyID", "Name", "contact", "email", "isDeleted"],
        },
        {
          model: Office,
          as: "officeDetails",
          attributes: ["officeID", "Address", "companyID", "isDeleted"],
        },
        {
          model: Department,
          as: "employeeDepartment",
          attributes: ["departmentID", "department", "isDeleted"],
        },
        {
          model: Designation,
          as: "employeeDesignation",
          attributes: ["designationID", "designation", "isDeleted"],
        },
        {
          model: EmployeeRole,
          as: "role",
          attributes: ["roleID", "role", "isDeleted"],
        },
      ],
    });

    if (nonAdminEmployees.length === 0) {
      return res.status(404).json({ message: "No employees found" });
    }

    res.status(200).json({
      message: "Employees Fetched Successfully.",
      data: nonAdminEmployees,
    });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: error.message });
  }
};

// Activate an employee by empId
module.exports.activateEmployee = async (req, res) => {
  try {
    const { Employee } = req.app.locals.models;
    const { empId, isActive } = req.body;
    const updatedBy = req.decodedEmpCode;

    if (!empId) {
      return res.status(400).json({ error: "empId is required" });
    }

    const employee = await Employee.findOne({ where: { empId } });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Update isActive to true
    await Employee.update({ isActive: isActive, updatedBy: updatedBy }, { where: { empId } });

    res.status(200).json({ message: "Employee activated successfully." });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: error.message });
  }
};
