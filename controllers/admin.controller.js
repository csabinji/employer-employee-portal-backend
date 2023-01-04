const responseHelper = require("../helper/responseHelper");
const { Admin } = require("../models");
const { SERVER_ERROR, PASSWORD_NOT_MATCHED, SAME_EMAIL, ADMIN_ADDED } = require("../utils/constVariables");
const bcrypt = require("bcrypt");
const tokenGenerator = require("../helper/tokenGenerator");

module.exports = {
    addAdmin: async (req, res) => {
        try {
            const { password, confirm_password, email, name } = req.body;

            const userWithSameEmail = await Admin.findOne({ email });
            if (userWithSameEmail) return responseHelper(false, SAME_EMAIL, 409, '', {}, res);

            if (password !== confirm_password) return responseHelper(false, PASSWORD_NOT_MATCHED, 422, '', {}, res);

            const encryptedPassword = await bcrypt.hash(password, 10);

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
    }
}