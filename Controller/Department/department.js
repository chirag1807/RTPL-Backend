const validator = require('validator');
const COMMON = require('../../Common/common');
const { createAccessToken } = require('../../Middleware/auth');
const CONSTANT = require('../../constant/constant');

const inputFieldsDepartment = [
  "department",
  "isActive",
  "isDeleted",
  "createdBy",
  "updatedBy",
  "deletedBy",
];

module.exports.addDepartment = async (req, res) => {
  try {
    const { Department } = req.app.locals.models;
    const updatedBy = req.decodedEmpCode;
    // get value of CreatedBy 
    // COMMON.setModelCreatedByFieldValue(req);
    // check createdBy is admin or not (means put this condition in below if condition.)
    if (req.body) {
      req.body.createdBy = updatedBy;
      const department = await Department.create(req.body, {
        fields: inputFieldsDepartment,
      });
      if (department) {
        res.status(200).json({
          message: "Your department has been registered successfully.",
        });
      } else {
        res.status(400).json({
          message:
            "Sorry, Your department has not registered. Please try again later",
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

module.exports.getDepartments = async (req, res) => {
  try {
    const { Department } = req.app.locals.models;

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
        [Op.or]: [{ department: { [Op.like]: `%${searchField}%` } }],
      };
    }

    queryOptions.where = { ...queryOptions.where, isActive: isActive ? isActive : true };

    const departments = await Department.findAll(queryOptions);

    if (departments) {
      res.status(200).json({
        message: "Departments Fetched Successfully.",
        departments: departments,
      });
    } else {
      res.status(400).json({
        message: "Departments Can't be Fetched, Please Try Again Later.",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

module.exports.getDepartmentByID = async (req, res) => {
  try {
    const { Department } = req.app.locals.models;
    if (req.params) {
      const { departmentID } = req.params;
      const department = await Department.findOne({
        where: {
          departmentID,
          //  isActive: true
        },
      });

      if (department) {
        res.status(200).json({
          message: "Department Fetched Successfully.",
          department: department,
        });
      } else {
        res.status(400).json({
          message: "Department Can't be Fetched, Please Try Again Later.",
        });
      }
    }
    else {
      console.log("Invalid perameter");
      res.status(400).json({ error: "Invalid perameter" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports.updateDepartment = async (req, res) => {
  try {
    const { Department } = req.app.locals.models;
    const updatedBy = req.decodedEmpCode;
    // get value of updatedBy
    // COMMON.setModelUpdatedByFieldValue(req);
    if (req.params && req.body) {
      const { departmentID } = req.params;

      const department = await Department.findByPk(departmentID);

      if (!department) {
        return res.status(404).json({ error: 'Department not found for the given ID' });
      }
      req.body.updatedBy = updatedBy;
      const updatedDepartment = await Department.update(req.body, {
        fields: inputFieldsDepartment,
        where: { departmentID: departmentID }
      });

      if (updatedDepartment) {
        res.status(200).json({ message: "Department has been Updated Successfully." });
      }
      else {
        res.status(400).json({ message: "Department has not been Updated, Please Try Again Later." });
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

module.exports.deleteDepartment = async (req, res) => {
  try {
    const { Department } = req.app.locals.models;
    const updatedBy = req.decodedEmpCode;
    // get value of deletedBy
    // COMMON.setModelDeletedByFieldValue(req);
    if (req.params) {
      const { departmentID } = req.params;

      const department = await Department.findByPk(departmentID);

      if (!department) {
        return res.status(404).json({ error: 'Department not found for the given ID' });
      }
      const updatedDepartment = await department.update({ deletedBy: updatedBy, isDeleted: true, isActive: false });
      if (updatedDepartment) {
        const deletedDepartment = await department.destroy();
        if (deletedDepartment) {
          res.status(200).json({ message: "Department has been Deleted Successfully." });
        }
        else {
          res.status(400).json({ message: "Department has not been Deleted, Please Try Again Later." });
        }
      } else {
        res.status(400).json({ message: "Department has not been Deleted, Please Try Again Later." });
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