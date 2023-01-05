const mongoose = require('mongoose');

const employerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
        underscore: true,
    }
);

module.exports = mongoose.model('Employer', employerSchema);