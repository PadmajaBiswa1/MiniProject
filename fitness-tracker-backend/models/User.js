const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6
    },
    personalInfo: {
        gender: {
            type: String,
            enum: ['male', 'female'],
            default: 'male'
        },
        age: {
            type: Number,
            min: 15,
            max: 150
        },
        height: {
            type: Number,
            min: 100,
            max: 250
        },
        weight: {
            type: Number,
            min: 30,
            max: 300
        },
        activityLevel: {
            type: Number,
            default: 1.55
        },
        healthCondition: {
            type: String,
            enum: ['none', 'diabetic', 'heart_patient', 'both'],
            default: 'none'
        }
    },
    goals: {
        type: {
            type: String,
            default: null
        },
        targetCalories: {
            type: Number,
            default: 0
        },
        targetProtein: {
            type: Number,
            default: 0
        },
        targetWeight: {
            type: Number,
            default: 0
        }
    },
    calculations: {
        bmr: Number,
        tdee: Number
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);