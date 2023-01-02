const { JWT_SECRET } = require("../config/env");
const responseHelper = require("../helper/responseHelper");
const { Admin } = require("../models");
const { SERVER_ERROR, PASSWORD_NOT_MATCHED } = require("../utils/constVariables");
const jwt = require('jsonwebtoken');

module.exports = {
    addAdmin: async (req, res) => {
        try {
            const { password, confirm_password, email, name } = req.body;
            if (password !== confirm_password) return responseHelper(false, PASSWORD_NOT_MATCHED, 422, '', {}, res);

            // Generate a JWT token
            const token = jwt.sign({}, JWT_SECRET);

            // Use the JWT token to encode the password
            const encryptedPassword = jwt.decode(token, password);

            return console.log(encryptedPassword);

            // Create a new Admin document
            const admin = new Admin({
                email,
                name,
                password: encryptedPassword
            });

            // Save the admin to the database
            const newAdmin = await admin.save();

            return responseHelper(true, ADMIN_ADDED, 201, '', { admin: newAdmin }, res);
        } catch (error) {
            console.log(error);
            return responseHelper(false, SERVER_ERROR, 500, '', {}, res);
        }
    }
}