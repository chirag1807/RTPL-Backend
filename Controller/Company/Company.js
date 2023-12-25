const validator = require('validator');
const COMMON = require('../../Common/common');
const { createAccessToken } = require('../../Middleware/auth');
const CONSTANT = require('../../constant/constant');

const inputFieldsCompany = [
    "Name",
    "contact",
    "email",
    "createdBy",
    "updatedBy",
    "deletedBy",
];

module.exports.addCompany = async (req, res) => {
    try {
        const { Company } = req.app.locals.models;
        // get value of CreatedBy 
        // COMMON.setModelCreatedByFieldValue(req);
        // check createdBy is admin or not (means put this condition in below if condition.)
        if (req.body) {
            const comapany = await Company.create(req.body, {
                fields: inputFieldsCompany,
            });
            if (comapany) {
                res.status(200).json({
                    message: "Your company has been registered successfully.",
                });
            } else {
                res.status(400).json({
                    message:
                        "Sorry, Your company has not registered. Please try again later",
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

module.exports.getCompanies = async (req, res) => {
    try {
        const { Company } = req.app.locals.models;

        const company = await Company.findAll({});

        if (company) {
            res.status(200).json({
                message: "Companies Fetched Successfully.",
                data: company,
            });
        } else {
            res.status(400).json({
                message: "Companies Can't be Fetched, Please Try Again Later.",
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

module.exports.getCompanyByID = async (req, res) => {
    try {
        const { Company } = req.app.locals.models;
        if (req.params) {
            const { companyID } = req.params;
            const company = await Company.findOne({
                where: { companyID },
            });

            if (company) {
                res.status(200).json({
                    message: "Company Fetched Successfully.",
                    data: company,
                });
            } else {
                res.status(400).json({
                    message: "Company Can't be Fetched, Please Try Again Later.",
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

module.exports.updatedCompany = async (req, res) => {
    try {
        const { Company } = req.app.locals.models;
        // get value of updatedBy
        // COMMON.setModelUpdatedByFieldValue(req);
        if (req.params && req.body) {
            const { companyID } = req.params;

            const company = await Company.findByPk(companyID);

            if (!company) {
                return res.status(404).json({ error: 'Company not found for the given ID' });
            }

            const updatedCompany = await Company.update(req.body, {
                where: { companyID: companyID },
                fields: inputFieldsCompany,
            });

            if (updatedCompany) {
                res.status(200).json({ message: "Company has been Updated Successfully." });
            }
            else {
                res.status(400).json({ message: "Company has not been Updated, Please Try Again Later." });
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

module.exports.deleteCompany = async (req, res) => {
    try {
        const { Company } = req.app.locals.models;

        if (req.params) {
            const { companyID } = req.params;

            const updatedCompany = await Company.update(
                { isDeleted: true, isActive: false },
                { where: { companyID: companyID } }
            );

            if (updatedCompany) {
                const deletedCompany = await Company.destroy({ where: { companyID: companyID } });

                if (deletedCompany) {
                    res.status(200).json({ message: "Company has been Deleted Successfully." });
                } else {
                    res.status(400).json({ message: "Company deletion failed." });
                }
            } else {
                res.status(400).json({ message: "Company update failed." });
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
