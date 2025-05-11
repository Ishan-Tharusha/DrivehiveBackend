import mongoose from "mongoose";

const salarySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', 
    },
    userType: {
        type: String,
        enum: ['driver', 'employee'],
        required: true,
    },
    salary: {
        type: Number,
        required: [true, "Salary is required"],
    },
    month: {
        type: Number,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    deductions:{
        type: Number,
        default: 0,
    },
    bonus:{
        type: Number,
        default: 0,
    },
    basic:{
        type: Number,
        default: 0,
    },
});

salarySchema.index({ user: 1, month: 1, year: 1 }, { unique: true }); // Ensure only one salary entry per user per month

const Salary = mongoose.model('Salary', salarySchema);
export default Salary;
