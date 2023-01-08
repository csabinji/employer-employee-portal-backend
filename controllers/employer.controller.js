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
const bcryptjs = require("bcryptjs");
const tokenGenerator = require("../helper/tokenGenerator");
const responseHelper = require("../helper/responseHelper");
const XLSX = require('xlsx');
const { sendMessage } = require("../config/publisher");

module.exports = {
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            // Find the employer by email
            const employer = await Employer.findOne({ email });
            if (!employer) return responseHelper(false, EMPLOYER_NOT_FOUND, 404, '', {}, res);

            // Check if the provided password is correct
            const isPasswordCorrect = await bcryptjs.compare(password, employer['password']);
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
            const { _id } = req.user;

            // Check if there is already an employee with the same email
            const employeeWithSameEmail = await Employee.findOne({ email });
            if (employeeWithSameEmail) return responseHelper(false, SAME_EMAIL, 409, '', {}, res);

            if (password !== confirm_password) return responseHelper(false, PASSWORD_NOT_MATCHED, 422, '', {}, res);

            // Hash the password
            const encryptedPassword = await bcryptjs.hash(password, 10);

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

            await Employer.updateOne({ _id }, { $push: { employee: newEmployee['_id'] } }, { upsert: true });

            return responseHelper(true, EMPLOYEE_ADDED, 201, '', newEmployee, res);
        } catch (error) {
            console.log(error);
            return responseHelper(false, SERVER_ERROR, 500, '', {}, res);
        }
    },
    listEmployee: async (req, res, next) => {
        try {
            const { _id } = req.user;

            const employees = await Employer.findById(_id)
                .populate({ path: 'employee', select: '-password' })
                .lean();

            return responseHelper(true, EMPLOYEE_ADDED, 201, '', employees ? employees.employee : [], res);
        } catch (error) {
            console.log(error);
            return responseHelper(false, SERVER_ERROR, 500, '', {}, res);
        }
    },
    updateEmployeeInfo: async (req, res) => {
        try {
            const { id } = req.params;

            let employee = await Employee.findById(id).lean();

            if (!employee) return responseHelper(false, 'Employee not found.', 401, '', {}, res);

            employee = await Employee.findOneAndUpdate({ _id: id }, { ...req.body }, { new: true });
            return responseHelper(false, 'Employee info updated.', 201, '', employee, res);
        } catch (error) {
            console.log(error);
            return responseHelper(false, SERVER_ERROR, 500, '', {}, res);
        }
    },
    deleteEmployee: async (req, res) => {
        try {
            const { id } = req.params;


            let employee = await Employee.findById(id).lean();

            if (!employee) return responseHelper(false, 'Employee not found.', 401, '', {}, res);

            await Employee.deleteOne({ _id: id });
            await Employer.updateOne({ _id: req.user['_id'] }, { $pull: { employee: id } }, { upsert: true });
            return responseHelper(false, 'Employee deleted successfully.', 201, '', {}, res);
        } catch (error) {
            console.log(error);
            return responseHelper(false, SERVER_ERROR, 500, '', {}, res);
        }
    },
    importEmployee: async (req, res) => {
        try {
            if (!req.file) return responseHelper(false, 'XLSX file not found!', 404, '', {}, res);

            const workbook = XLSX.readFile(req.file.path);

            const sheet = workbook.Sheets[workbook.SheetNames[0]];

            const jsonData = await XLSX.utils.sheet_to_json(sheet);

            let employee = await Promise.all(jsonData.map(async (emp) => {
                const userWithSameEmail = await Employee.findOne({ email: emp.email });
                if (userWithSameEmail) return; // skip this employee if they already exist in the database

                const encryptedPassword = await bcryptjs.hash(emp.password.toString(), 10);
                emp.password = encryptedPassword;

                return emp;
            }));

            employee = await employee.filter((emp) => emp !== null && emp !== undefined);

            if (employee.length != 0) {
                employee.map(async (e) => { await sendMessage(e) });
            }

            return responseHelper(false, 'Employee details imported.', 201, '', {}, res);
        } catch (error) {
            console.log(error);
            return responseHelper(false, SERVER_ERROR, 500, '', {}, res);
        }
    }
}