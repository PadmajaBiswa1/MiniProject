const mongoose = require('mongoose');

const trackingEntrySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    calories: {
        type: Number,
        required: true,
        min: 0,
        max: 2000
    },
    protein: {
        type: Number,
        required: true,
        min: 0,
        max: 160
    },
    weight: {
        type: Number,
        required: true,
        min: 30,
        max: 200
    }
}, {
    timestamps: true
});

// Compound index to ensure one entry per user per day
trackingEntrySchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('TrackingEntry', trackingEntrySchema);