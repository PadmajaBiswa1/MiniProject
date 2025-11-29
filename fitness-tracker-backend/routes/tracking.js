const express = require('express');
const { body } = require('express-validator');
const { 
    addEntry, 
    getHistory, 
    getProgressStats 
} = require('../controllers/trackingController');
const auth = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// All routes are protected
router.use(auth);

// Add tracking entry
router.post('/entries', [
    body('date').isISO8601().withMessage('Valid date is required'),
    body('calories').isInt({ min: 0, max: 2000 }).withMessage('Calories must be between 0 and 2000'),
    body('protein').isInt({ min: 0, max: 160 }).withMessage('Protein must be between 0 and 160g'),
    body('weight').isFloat({ min: 30, max: 200 }).withMessage('Weight must be between 30 and 200 kg')
], handleValidationErrors, addEntry);

// Get tracking history
router.get('/entries', getHistory);

// Get progress stats
router.get('/progress-stats', getProgressStats);

module.exports = router;