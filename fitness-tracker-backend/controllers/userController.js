const User = require('../models/User');

// Update personal information
const updatePersonalInfo = async (req, res) => {
    try {
        const { gender, age, height, weight, activityLevel, healthCondition } = req.body;

        const user = await User.findByIdAndUpdate(
            req.user._id,
            {
                personalInfo: {
                    gender,
                    age,
                    height,
                    weight,
                    activityLevel,
                    healthCondition
                }
            },
            { new: true, runValidators: true }
        ).select('-password');

        res.json({
            success: true,
            message: 'Personal information updated successfully',
            data: { user }
        });
    } catch (error) {
        console.error('Update personal info error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating personal information'
        });
    }
};

// Calculate recommendations
const calculateRecommendations = async (req, res) => {
    try {
        const { gender, age, height, weight, activityLevel } = req.body;

        // Mifflin-St Jeor calculation
        const calculateBMR = (weight, height, age, gender) => {
            if (gender === 'male') {
                return 10 * weight + 6.25 * height - 5 * age + 5;
            } else {
                return 10 * weight + 6.25 * height - 5 * age - 161;
            }
        };

        const calculateTDEE = (bmr, activityLevel) => {
            return bmr * activityLevel;
        };

        const bmr = calculateBMR(weight, height, age, gender);
        const tdee = calculateTDEE(bmr, activityLevel);

        // Store calculations in user profile
        await User.findByIdAndUpdate(req.user._id, {
            calculations: { bmr, tdee }
        });

        // Determine recommendation
        let suggestedAction, targetCalories, targetProtein, targetWeightChange;

        if (tdee > 2500 && weight > 80) {
            suggestedAction = "Weight Loss";
            targetCalories = Math.round(tdee * 0.85);
            targetProtein = Math.round(weight * 2.2);
            targetWeightChange = `Lose ${Math.round(weight * 0.08)} kg (8% of current weight)`;
        } else if (tdee < 2000 && weight < 60) {
            suggestedAction = "Weight Gain";
            targetCalories = Math.round(tdee * 1.15);
            targetProtein = Math.round(weight * 2.0);
            targetWeightChange = `Gain ${Math.round(weight * 0.08)} kg (8% of current weight)`;
        } else {
            suggestedAction = "Maintenance";
            targetCalories = Math.round(tdee);
            targetProtein = Math.round(weight * 1.6);
            targetWeightChange = "Maintain current weight";
        }

        res.json({
            success: true,
            data: {
                bmr: Math.round(bmr),
                tdee: Math.round(tdee),
                suggestedAction,
                targetCalories,
                targetProtein,
                targetWeightChange,
                suggestedGoal: {
                    type: suggestedAction,
                    targetCalories,
                    targetProtein,
                    targetWeight: suggestedAction === "Weight Loss" ? Math.round((weight * 0.92) * 10) / 10 : 
                                  suggestedAction === "Weight Gain" ? Math.round((weight * 1.08) * 10) / 10 : weight
                }
            }
        });
    } catch (error) {
        console.error('Calculate recommendations error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while calculating recommendations'
        });
    }
};

// Update goals
// controllers/userController.js - Update the updateGoals function
const updateGoals = async (req, res) => {
    try {
        const { type, targetCalories, targetProtein, targetWeight } = req.body;

        // Validate and convert all values to numbers
        const goals = {
            type: type || 'Custom Goal',
            targetCalories: Number(targetCalories),
            targetProtein: Number(targetProtein),
            targetWeight: Number(targetWeight)
        };

        // Double-check that we have valid numbers
        if (isNaN(goals.targetCalories) || isNaN(goals.targetProtein) || isNaN(goals.targetWeight)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid number values provided for goals'
            });
        }

        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        user.goals = goals;
        await user.save();

        res.json({
            success: true,
            message: 'Goals updated successfully',
            data: { goals }
        });

    } catch (error) {
        console.error('Goals update error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating goals'
        });
    }
};

module.exports = {
    updatePersonalInfo,
    calculateRecommendations,
    updateGoals
};