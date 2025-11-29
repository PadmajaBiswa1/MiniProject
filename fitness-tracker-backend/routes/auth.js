const express = require('express');
const { body } = require('express-validator');
const { register, login, getCurrentUser } = require('../controllers/authController');
const auth = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// Register route
router.post('/register', [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], handleValidationErrors, register);

// Login route
router.post('/login', [
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password').exists().withMessage('Password is required')
], handleValidationErrors, login);

// Get current user route
router.get('/me', auth, getCurrentUser);

module.exports = router;