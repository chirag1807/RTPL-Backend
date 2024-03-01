const COMMON = require("../../Common/common");
const CONSTANT = require("../../constant/constant");
const { createAccessToken } = require("../../Middleware/auth");
const { Op } = require("sequelize");
const inputFieldsEmployee = [
  "firstName",
  "lastName",
  "emp_code",
  "department",
  "destination",
  "permissions",
  "email",
  "phone",
  "company",
  "Office",
  "password",
  "isActive",
  "isAdmin",
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
        .json({ 
          response_type: "FAILED",
          data: {},
          message: `Employee with id ${id} not found` });
    }

    COMMON.setModelUpdatedByFieldValue(req);

    if (req.body.password) {
      const hashedPassword = await COMMON.ENCRYPT(req.body.password);
      if (!hashedPassword) {
        return res
          .status(500)
          .json({ 
            response_type: "FAILED",
            data: {},
            message: CONSTANT.MESSAGE_CONSTANT.SOMETHING_WENT_WRONG });
      }
      req.body.password = hashedPassword;
    }

    req.body.updatedBy = updatedBy;

    await Employee.update(req.body, {
      where: { empId: id },
      fields: inputFieldsEmployee,
    });

    res.status(200).json({ 
      response_type: "SUCCESS",
      data: {},
      message: "Employee updated successfully" });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ 
      response_type: "FAILED",
      data: {},
      message: error.message });
  }
};

// delete employees details
module.exports.deleteEmployee = async (req, res) => {
  try {
    const { Employee } = req.app.locals.models;
    const updatedBy = req.decodedEmpCode;
    let { isDeleted } = req.query;
    if (req.params.id) {
      const empId = req.params.id;
      const employeeDetails = await Employee.findByPk(empId);
      if (employeeDetails) {
        await employeeDetails.update({
          isDeleted: isDeleted,
          isActive: false,
          deletedBy: updatedBy,
        });
        // await employeeDetails.destroy();

        res.status(200).json({
          response_type: "SUCCESS",
          data: {},
          message: "Employee deleted successfully." });
      } else {
        res.status(404).json({ 
          response_type: "FAILED",
          data: {},
          message: `Employee with id ${empId} not found.` });
      }
    } else {
      console.log("Invalid perameter");
      res.status(400).json({ 
        response_type: "FAILED",
        data: {},
        message: "Invalid perameter" });
    }
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ 
      response_type: "FAILED",
      data: {},
      message: error.message });
  }
};

//get All Employees
module.exports.getNonAdminEmployees = async (req, res) => {
  try {
    const { Employee, Company, Office, Department, Designation, EmployeeRole } =
      req.app.locals.models;

    let {
      page,
      pageSize,
      sort,
      sortBy,
      searchField,
      isActive,
      isDeleted,
      history,
    } = req.query;

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
          { anniversaryDate: { [Op.like]: `%${searchField}%` } },
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

    if (history && history == 1) {
      queryOptions.where = {
        ...queryOptions.where,
        [Op.or]: [{ isActive: 1 }, { isDeleted: 1 }],
        isAdmin: 0,
      };
    } else {
      queryOptions.where = {
        ...queryOptions.where,
        isActive: isActive != undefined ? isActive : 1,
        isDeleted: isDeleted != undefined ? isDeleted : 0,
        isAdmin: 0,
        isRecept: 0,
      };
    }

    const totalCount = await Employee.count({
      where: queryOptions.where,
    });
    const totalPage = Math.ceil(totalCount / pageSize);

    const nonAdminEmployees = await Employee.findAll(queryOptions);

    if (nonAdminEmployees.length === 0) {
      return res.status(200).json({ 
        totalPage: 0,
        currentPage: 0,
        response_type: "SUCCESS",
        message: "No employees found",
        data: {
          nonAdminEmployees: []
        }
      });
    }

    res.status(200).json({
      totalPage: totalPage,
      currentPage: page,
      response_type: "SUCCESS",
      message: "Employees Fetched Successfully.",
      data: {
        nonAdminEmployees: nonAdminEmployees},
    });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ 
      response_type: "FAILED",
      data: {},
      message: error.message });
  }
};

//true or

//get Employee By Id
module.exports.getNonAdminEmployeesById = async (req, res) => {
  try {
    const { Employee, Company, Office, Department, Designation, EmployeeRole } =
      req.app.locals.models;
    const { empId } = req.params;

    const nonAdminEmployees = await Employee.findAll({
      where: {
        isAdmin: 0,
        // isActive: 1,
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
      return res.status(404).json({
        response_type: "SUCCESS",
        message: "No employees found",
        data: {
          nonAdminEmployees: []
        }
      });
    }

    res.status(200).json({
      response_type: "SUCCESS",
      message: "Employees Fetched Successfully.",
      data: {
        nonAdminEmployees: nonAdminEmployees},
    });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ 
      response_type: "FAILED",
      data: {},
      message: error.message });
  }
};

// Activate an employee by empId
module.exports.activateEmployee = async (req, res) => {
  try {
    const { Employee } = req.app.locals.models;
    const { empId, isActive } = req.body;
    const updatedBy = req.decodedEmpCode;

    if (!empId) {
      return res.status(400).json({ 
        response_type: "FAILED",
        data: {},
        message: "empId is required" });
    }

    const employee = await Employee.findOne({ where: { empId } });

    if (!employee) {
      return res.status(404).json({ 
        response_type: "FAILED",
        data: {},
        message: "Employee not found" });
    }

    // Update isActive to true
    const employeeUpdated = await employee.update({
      isActive: isActive,
      updatedBy: updatedBy,
    });
    // const employeeUpdated = await Employee.update({ isActive: isActive, updatedBy: updatedBy }, { where: { empId } });

    if (employeeUpdated) {
      const token = createAccessToken(employeeUpdated.dataValues);
      res.status(200).json({
        response_type: "SUCCESS",
        message: "Employee activated successfully.",
        data: {token: token},
      });
    } else {
      res.status(400).json({
        response_type: "FAILED",
        data: {},
        message: "Employee can not be activated.",
      });
    }
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ 
      response_type: "FAILED",
      data: {},
      message: error.message });
  }
};

module.exports.getEmployeeByEmpCode = async (req, res) => {
  try {
    const { Employee, Company, Office, Department, Designation, EmployeeRole } =
      req.app.locals.models;
    const { emp_code } = req.params;

    const employees = await Employee.findAll({
      where: {
        // isActive: 1,
        emp_code: emp_code,
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

    if (employees.length === 0) {
      return res.status(404).json({ 
        response_type: "FAILED",
        data: {},
        message: "No employees found" });
    }

    res.status(200).json({
      response_type: "SUCCESS",
      data: {employees: employees},
      message: "Employees Fetched Successfully.",
    });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ 
      response_type: "FAILED",
      data: {},
      message: error.message });
  }
};
