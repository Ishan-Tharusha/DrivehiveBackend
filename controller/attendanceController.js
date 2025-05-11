import DriverAttendance from "../model/attendance.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";

const addAttendance = asyncErrorHandler(async (req, res, next) => {
  const { driver, date } = req.body;

  const driveAtten = await DriverAttendance.create({
    driver,
    date,
  });
  res
    .status(201)
    .send({ message: "Driver attendance marked successfully", driveAtten });
});

const gellAllAttence = asyncErrorHandler(async (req, res, next) => {
  const attendanceCounts = await DriverAttendance.aggregate([
    {
        $group: {
            _id: "$driver",
            count: { $sum: 1 } // Count the occurrences for each driver
        }
    },
    {
        $lookup: {
            from: "users", // Assuming the collection name is 'users' for driver details
            localField: "_id",
            foreignField: "_id",
            as: "driverDetails"
        }
    },
    {
        $unwind: "$driverDetails" // Unwind the array created by the lookup
    },
    {
        $project: {
            _id: 0, // Exclude _id field
            count: 1,
            driver: "$driverDetails" // Rename the 'driverDetails' to 'driver'
        }
    }
]);

res.status(200).json(attendanceCounts);
});

export { addAttendance,gellAllAttence };
