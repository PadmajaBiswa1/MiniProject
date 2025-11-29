const TrackingEntry = require('../models/TrackingEntry');

// Add or update tracking entry
const addEntry = async (req, res) => {
    try {
        const { date, calories, protein, weight } = req.body;
        const userId = req.user._id;

        // Validate date is not in the future
        const selectedDate = new Date(date);
        const today = new Date();
        selectedDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        if (selectedDate > today) {
            return res.status(400).json({
                success: false,
                message: 'Cannot add entries for future dates'
            });
        }

        // Check if entry already exists for this date
        const existingEntry = await TrackingEntry.findOne({
            userId,
            date: selectedDate
        });

        let entry;
        if (existingEntry) {
            // Update existing entry
            entry = await TrackingEntry.findByIdAndUpdate(
                existingEntry._id,
                { calories, protein, weight },
                { new: true, runValidators: true }
            );
        } else {
            // Create new entry
            entry = new TrackingEntry({
                userId,
                date: selectedDate,
                calories,
                protein,
                weight
            });
            await entry.save();
        }

        res.json({
            success: true,
            message: 'Tracking entry saved successfully',
            data: { entry }
        });
    } catch (error) {
        console.error('Add entry error:', error);
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Entry already exists for this date'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server error while saving tracking entry'
        });
    }
};

// Get tracking history
const getHistory = async (req, res) => {
    try {
        const userId = req.user._id;
        const entries = await TrackingEntry.find({ userId })
            .sort({ date: 1 })
            .select('-userId -__v');

        res.json({
            success: true,
            data: { entries }
        });
    } catch (error) {
        console.error('Get history error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching tracking history'
        });
    }
};

// Get progress stats
const getProgressStats = async (req, res) => {
    try {
        const userId = req.user._id;
        const latestEntry = await TrackingEntry.findOne({ userId })
            .sort({ date: -1 });

        res.json({
            success: true,
            data: { latestEntry: latestEntry || null }
        });
    } catch (error) {
        console.error('Get progress stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching progress stats'
        });
    }
};

module.exports = {
    addEntry,
    getHistory,
    getProgressStats
};