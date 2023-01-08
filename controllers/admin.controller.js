const responseHelper = require("../helper/responseHelper");
const { Admin, Employer } = require("../models");
const { SERVER_ERROR, PASSWORD_NOT_MATCHED, SAME_EMAIL, ADMIN_ADDED, INVALID_PASSWORD, ADMIN_NOT_FOUND, LOGIN_SUCCESS, EMPLOYER_ADDED } = require("../utils/constVariables");
const bcryptjs = require("bcryptjs");
const tokenGenerator = require("../helper/tokenGenerator");

module.exports = {
    addAdmin: async (req, res) => {
        try {
            const { password, confirm_password, email, name } = req.body;

            const userWithSameEmail = await Admin.findOne({ email });
            if (userWithSameEmail) return responseHelper(false, SAME_EMAIL, 409, '', {}, res);

            if (password !== confirm_password) return responseHelper(false, PASSWORD_NOT_MATCHED, 422, '', {}, res);

            const encryptedPassword = await bcryptjs.hash(password, 10);

            // Create a new Admin document
            const admin = new Admin({
                email,
                name,
                password: encryptedPassword
            });

            // Save the admin to the database
            const newAdmin = await admin.save();

            const token = await tokenGenerator(newAdmin);
            return responseHelper(true, ADMIN_ADDED, 201, '', token, res);
        } catch (error) {
            console.log(error);
            return responseHelper(false, SERVER_ERROR, 500, '', {}, res);
        }
    },
    adminLogin: async (req, res) => {
        try {
            const { email, password } = req.body;

            // Find the admin by email
            const admin = await Admin.findOne({ email });
            if (!admin) return responseHelper(false, ADMIN_NOT_FOUND, 404, '', {}, res);

            // Check if the provided password is correct
            const isPasswordCorrect = await bcryptjs.compare(password, admin['password']);
            if (!isPasswordCorrect) return responseHelper(false, INVALID_PASSWORD, 401, '', {}, res);

            // Generate a JWT token
            const token = await tokenGenerator(admin);

            return responseHelper(true, LOGIN_SUCCESS, 200, '', token, res);
        } catch (error) {
            console.log(error);
            return responseHelper(false, SERVER_ERROR, 500, '', {}, res);
        }
    },
    addEmployer: async (req, res) => {
        try {
            const { name, company, email, password, confirm_password } = req.body;

            // Check if there is already an employer with the same email
            const employerWithSameEmail = await Employer.findOne({ email });
            if (employerWithSameEmail) return responseHelper(false, SAME_EMAIL, 409, '', {}, res);

            if (password !== confirm_password) return responseHelper(false, PASSWORD_NOT_MATCHED, 422, '', {}, res);

            // Hash the password
            const encryptedPassword = await bcryptjs.hash(password, 10);

            // Create a new Employer document
            const employer = new Employer({
                name,
                email,
                company,
                password: encryptedPassword
            });

            // Save the employer to the database
            const newEmployer = await employer.save();

            return responseHelper(true, EMPLOYER_ADDED, 201, '', newEmployer, res);
        } catch (error) {
            console.log(error);
            return responseHelper(false, SERVER_ERROR, 500, '', {}, res);
        }
    },
    listEmployer: async (req, res) => {
        try {
            const employer = await Employer.find().lean();
            return responseHelper(true, "Employer list fetached", 201, '', employer, res);
        } catch (error) {
            console.log(error);
            return responseHelper(false, SERVER_ERROR, 500, '', {}, res);
        }
    }
}