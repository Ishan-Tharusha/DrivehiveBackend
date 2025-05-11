import Salary from '../model/salarySchema.js';
import asyncErrorHandler from '../utils/asyncErrorHandler.js';
import { CustomError } from '../utils/customerError.js';
import User from '../model/userModel.js';
import DriverAttendance from '../model/attendance.js';
const addSalary = asyncErrorHandler(async (req, res, next) => {
    const { user, userType, salary, month, year, deductions, bonus,basic } = req.body;

    const existingSalary = await Salary.findOne({ user, month, year });
    if (existingSalary) {
        const error = new CustomError("Salary entry for this user already exists for the given month and year", 400);
        return next(error);
    }

    const newSalary = await Salary.create({ user, userType, salary, month, year, deductions, bonus,basic });
    res.status(201).send(newSalary);
});

const getSalaries = asyncErrorHandler(async (req, res, next) => {
    const salaries = await Salary.find().populate('user', 'name email');
    res.status(200).send(salaries);
});

const getSalaryById = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;
    const salary = await Salary.findById(id).populate('user', 'name email');
    if (!salary) {
        const error = new CustomError("Salary not found", 404);
        return next(error);
    }
    res.status(200).send(salary);
});

const updateSalary = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;
    const body = req.body;
    const updatedSalary = await Salary.findByIdAndUpdate(id, body, { new: true });

    // if (!updatedSalary) {
    //     const error = new CustomError("Salary not found", 404);
    //     return next(error);
    // }
    res.status(200).send(updatedSalary);
});
const deleteSalary = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;
    const deletedSalary = await Salary.findByIdAndDelete(id);

    if (!deletedSalary) {
        const error = new CustomError("Salary not found", 404);
        return next(error);
    }
    res.status(200).send({ message: "Salary deleted successfully" });
});

const getUsersWithoutSalary = asyncErrorHandler(async (req, res, next) => {
    const { month, year } = req.query;

    if (!month || !year) {
        const error = new CustomError("Month and year are required", 400);
        return next(error);
    }

    // Find users who already have a salary entry for the given month and year
    const salariedUsers = await Salary.find({ month, year }).select('user');
    const salariedUserIds = salariedUsers.map(salary => salary.user);

    // Find users who don't have a salary entry for the given month and year, and only those with roles 'employee' and 'driver'
    const usersWithoutSalary = await User.find({
        _id: { $nin: salariedUserIds },
        isActive: true,
        role: { $in: ['employee', 'driver'] }
    }).select('_id name role');

    // Fetch attendance count for drivers
    const attendanceCounts = await DriverAttendance.aggregate([
        {
            $match: {
                date: {
                    $gte: new Date(`${year}-${month}-01`),
                    $lte: new Date(`${year}-${month}-31`)
                }
            }
        },
        {
            $group: {
                _id: '$driver',
                attendanceCount: { $sum: 1 }
            }
        }
    ]);

    const attendanceMap = new Map();
    attendanceCounts.forEach(record => {
        attendanceMap.set(record._id.toString(), record.attendanceCount);
    });

    // Calculate basic salary for each user and filter out drivers with 0 attendance
    const basicSalary = 20000;
    const basicSalary2 = 10000;
    const result = usersWithoutSalary
        .map(user => {
            if (user.role === 'driver') {
                const attendanceCount = attendanceMap.get(user._id.toString()) || 0;
                if (attendanceCount > 0) {
                    return {
                        _id: user._id,
                        name: user.name,
                        role: user.role,
                        basicSalary: attendanceCount * 2000 +basicSalary2
                    };
                }
            } else if (user.role === 'employee') {
                return {
                    _id: user._id,
                    name: user.name,
                    role: user.role,
                    basicSalary: basicSalary
                };
            }
        })
        .filter(user => user !== undefined); // Filter out undefined results

    res.status(200).send(result);
});


export { addSalary, getSalaries, getSalaryById, updateSalary, deleteSalary,getUsersWithoutSalary };
