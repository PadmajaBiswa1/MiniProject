const express = require('express');
const { body } = require('express-validator');
const { 
    updatePersonalInfo, 
    calculateRecommendations, 
    updateGoals 
} = require('../controllers/userController');
const auth = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// All routes are protected
router.use(auth);

// Update personal information
router.put('/personal-info', [
    body('gender').isIn(['male', 'female']).withMessage('Gender must be male or female'),
    body('age').isInt({ min: 15, max: 150 }).withMessage('Age must be between 15 and 150'),
    body('height').isInt({ min: 100, max: 250 }).withMessage('Height must be between 100 and 250 cm'),
    body('weight').isFloat({ min: 30, max: 300 }).withMessage('Weight must be between 30 and 300 kg'),
    body('activityLevel').isFloat({ min: 1.2, max: 1.9 }).withMessage('Invalid activity level'),
    body('healthCondition').isIn(['none', 'diabetic', 'heart_patient', 'both']).withMessage('Invalid health condition')
], handleValidationErrors, updatePersonalInfo);

// Calculate recommendations
router.post('/calculate-recommendations', [
    body('gender').isIn(['male', 'female']).withMessage('Gender must be male or female'),
    body('age').isInt({ min: 15, max: 150 }).withMessage('Age must be between 15 and 150'),
    body('height').isInt({ min: 100, max: 250 }).withMessage('Height must be between 100 and 250 cm'),
    body('weight').isFloat({ min: 30, max: 300 }).withMessage('Weight must be between 30 and 300 kg'),
    body('activityLevel').isFloat({ min: 1.2, max: 1.9 }).withMessage('Invalid activity level')
], handleValidationErrors, calculateRecommendations);

// routes/users.js - Updated goals route with better validation
router.put('/goals', [
    body('type')
        .isString()
        .trim()
        .notEmpty()
        .withMessage('Goal type is required'),
    body('targetCalories')
        .custom((value) => {
            const num = Number(value);
            return !isNaN(num) && num > 0 && num <= 5000;
        })
        .withMessage('Target calories must be a valid number between 1 and 5000'),
    body('targetProtein')
        .custom((value) => {
            const num = Number(value);
            return !isNaN(num) && num > 0 && num <= 400;
        })
        .withMessage('Target protein must be a valid number between 1 and 400'),
    body('targetWeight')
        .custom((value) => {
            const num = Number(value);
            return !isNaN(num) && num > 0 && num <= 300;
        })
        .withMessage('Target weight must be a valid number between 1 and 300'),
], handleValidationErrors, updateGoals);

module.exports = router;

