const { Employee, Employer } = require("../models");
const {
    SERVER_ERROR,
    SAME_EMAIL,
    PASSWORD_NOT_MATCHED,
    EMPLOYEE_ADDED,
    EMPLOYER_NOT_FOUND,
    INVALID_PASSWORD,
    LOGIN_SUCCESS
} = require("../utils/constVariables");
const bcrypt = require("bcrypt");
const tokenGenerator = require("../helper/tokenGenerator");
const responseHelper = require("../helper/responseHelper");

module.exports = {
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            // Find the employer by email
            const employer = await Employer.findOne({ email });
            if (!employer) return responseHelper(false, EMPLOYER_NOT_FOUND, 404, '', {}, res);

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
    addEmployee: async (req, res, next) => {
        try {
            const { name, company, email, password, title, yearly_salary, confirm_password } = req.body;

            // Check if there is already an employee with the same email
            const employeeWithSameEmail = await Employee.findOne({ email });
            if (employeeWithSameEmail) return responseHelper(false, SAME_EMAIL, 409, '', {}, res);

            if (password !== confirm_password) return responseHelper(false, PASSWORD_NOT_MATCHED, 422, '', {}, res);

            // Hash the password
            const encryptedPassword = await bcrypt.hash(password, 10);

            // Create a new Employee document
            const employee = new Employee({
                name,
                email,
                company,
                title,
                yearly_salary,
                password: encryptedPassword
            });

            // Save the employee to the database
            const newEmployee = await employee.save();

            return responseHelper(true, EMPLOYEE_ADDED, 201, '', newEmployee, res);
        } catch (error) {
            console.log(error);
            return responseHelper(false, SERVER_ERROR, 500, '', {}, res);
        }
    }
}