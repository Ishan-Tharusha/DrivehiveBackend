import mongoose from "mongoose";
const driverAttendanceSchema = new mongoose.Schema({
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user', // Reference to the Driver model
     
    },
    date: {
      type: Date,
      
    },
    // You can add more fields like status, remarks, etc. if needed
  });

  const DriverAttendance = mongoose.model('DriverAttendance', driverAttendanceSchema);

  export default DriverAttendance;