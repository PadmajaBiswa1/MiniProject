const { validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('Validation errors:', errors.array()); // 👈 this will show details in terminal
        return res.status(400).json({
            success: false,
            // show first error message instead of generic text
            message: errors.array()[0].msg,
            errors: errors.array()
        });
    }
    next();
};

module.exports = { handleValidationErrors };
