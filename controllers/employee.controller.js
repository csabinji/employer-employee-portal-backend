const responseHelper = require("../helper/responseHelper");
const { Employee } = require("../models");
const { SERVER_ERROR, INVALID_PASSWORD, LOGIN_SUCCESS, EMPLOYEE_NOT_FOUND } = require("../utils/constVariables");
const bcrypt = require("bcrypt");
const tokenGenerator = require("../helper/tokenGenerator");

module.exports = {
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            // Find the employer by email
            const employer = await Employee.findOne({ email });
            if (!employer) return responseHelper(false, EMPLOYEE_NOT_FOUND, 404, '', {}, res);

            // Check if the provided password is correct
            const isPasswordCorrect = await bcrypt.compare(password, employer['password']);
            if (!isPasswordCorrect) return responseHelper(false, INVALID_PASSWORD, 401, '', {}, res);

            // Generate a JWT token
            const token = await tokenGenerator(employer);

            return responseHelper(true, LOGIN_SUCCESS, 200, '', token, res);
        } catch (error) {
            console.log(error);
            return responseHelper(false, SERVER_ERROR, 500, '', {}, res);
        }
    },
    getEmployee: async (req, res) => {
        try {
            const { _id } = req.user;
            const employee = await Employee.findById(_id).lean();
            return responseHelper(false, 'Employee details fetched.', 500, '', employee, res);
        } catch (error) {
            console.log(error);
            return responseHelper(false, SERVER_ERROR, 500, '', {}, res);
        }
    }
}