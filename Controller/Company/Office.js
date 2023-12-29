const validator = require('validator');
const COMMON = require('../../Common/common');
const { createAccessToken } = require('../../Middleware/auth');
const CONSTANT = require('../../constant/constant');

const inputFieldsOffice = [
    "companyID",
    "Address",
    "createdBy",
    "updatedBy",
    "deletedBy",
];

module.exports.addOffice = async (req, res) => {
    try {
        const { Office } = req.app.locals.models;
        // get value of CreatedBy 
        // COMMON.setModelCreatedByFieldValue(req);
        // check createdBy is admin or not (put this condition below)
        const updatedBy = req.decodedEmpCode;
        if (req.body) {
            req.body.createdBy = updatedBy;
            const office = await Office.create(req.body, {
                fields: inputFieldsOffice,
            });
            if (office) {
                res.status(200).json({
                    message: "Your office has been registered successfully.",
                });
            } else {
                res.status(400).json({
                    message: "Sorry, Your office has not been registered. Please try again later.",
                });
            }
        } else {
            console.log("Invalid parameter");
            res.status(400).json({ error: "Invalid parameter" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

module.exports.updateOffice = async (req, res) => {
    try {
        const { Office } = req.app.locals.models;
        const { officeID } = req.params;
        const updatedBy = req.decodedEmpCode;

        if (!officeID || !req.body.Address) {
            return res.status(400).json({ error: "Invalid parameter or missing Address in the request body." });
        }

        const office = await Office.findByPk(officeID);

        if (!office) {
            return res.status(404).json({ error: "Office not found for the given ID." });
        }

        const updatedOffice = await office.update({ updatedBy: updatedBy, Address: req.body.Address });

        if (updatedOffice) {
            res.status(200).json({ message: "Office address has been updated successfully." });
        } else {
            res.status(400).json({ message: "Failed to update office address." });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

module.exports.getOfficesByCompany = async (req, res) => {
    try {
        const { Office } = req.app.locals.models;
        const { companyID } = req.params;

        if (!companyID) {
            return res.status(400).json({ error: "Missing companyID in request parameters." });
        }

        const offices = await Office.findAll({
            where: { companyID: companyID },
        });

        res.status(200).json({ data: offices });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

module.exports.getOffices = async (req, res) => {
    try {
        const { Office } = req.app.locals.models;

        const offices = await Office.findAll({});

        if (offices) {
            res.status(200).json({
                message: "Offices Fetched Successfully.",
                data: offices,
            });
        } else {
            res.status(400).json({
                message: "Offices Can't be Fetched, Please Try Again Later.",
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

module.exports.getOfficeByID = async (req, res) => {
    try {
        const { Office } = req.app.locals.models;
        if (req.params) {
            const { officeID } = req.params;
            const office = await Office.findOne({
                where: { officeID },
            });

            if (office) {
                res.status(200).json({
                    message: "Office Fetched Successfully.",
                    data: office,
                });
            } else {
                res.status(400).json({
                    message: "Office Can't be Fetched, Please Try Again Later.",
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

module.exports.deleteOffice = async (req, res) => {
    try {
        const { Office } = req.app.locals.models;
        const { officeID } = req.params;
        const updatedBy = req.decodedEmpCode;

        if (!officeID) {
            return res.status(400).json({ error: "Missing officeID in request parameters." });
        }

        const office = await Office.findByPk(officeID);

        if (!office) {
            return res.status(404).json({ error: "Office not found for the given ID." });
        }

        const updatedOffice = await office.update({ deletedBy: updatedBy, isDeleted: true, isActive: false });

        if (updatedOffice) {
            const deletedOffice = await office.destroy();

            if (deletedOffice) {
                res.status(200).json({ message: "Office has been deleted successfully." });
            } else {
                res.status(400).json({ message: "Failed to delete office." });
            }
        } else {
            res.status(400).json({ message: "Failed to update office status." });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};
