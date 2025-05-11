import bcrypt from "bcryptjs";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import { CustomError } from "../utils/customerError.js";
import sendEmail from "../utils/sendEmail.js";
import user from "../model/userModel.js";
import UserLog from "../model/userlog.js";

const addEmployee = asyncErrorHandler(async (req, res, next) => {
  const { name, email, phoneNo,address } = req.body;

  const exits = await user.findOne({ email });
  if (exits) {
    const error = new CustomError("UserName already have", 404);
    return next(error);
  }
  function generateRandomString(length) {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  }
  function generateMemorablePassword() {
    const words = generateRandomString(3);
    const separators = ["-", "_", ".", "!", "#"];
    const randomWord = () => words[Math.floor(Math.random() * words.length)];
    const randomNumber = () => Math.floor(Math.random() * 10); // random digit
    const randomSeparator = () =>
      separators[Math.floor(Math.random() * separators.length)];

    return `rentalemp${randomSeparator()}${randomNumber()}${randomWord()}`;
  }

  const newPassword = generateMemorablePassword();
  console.log(newPassword);

  bcrypt.genSalt(10, function (err, salt) {
    if (err) {
      const error = new CustomError("Hash error", 404);
      return next(error);
    }
    bcrypt.hash(newPassword, salt, async function (err, hash) {
      if (err) {
        const error = new CustomError("Hash error", 404);
        return next(error);
      }
      // Store hash in your password DB.
      const addemp = await user.create({
        name,
        email,
        phoneNo,
        address,
        password: hash, 
        role:"employee"
      });

      const url = `${process.env.BASE_URL}/login`;
      await sendEmail({

        name:addemp.name,
        email:addemp.email,
       subject: `your Login UserName password`,
        pass:newPassword,
        url:url
      }
      );
      res.status(201).send({ message: "E-mail password send to the mail" });
    });
  });
});

const allEmp = asyncErrorHandler(async (req, res, next) => {
  const getallEmp = await user.find({role:'employee',isActive:true}).select("-password");
  res.status(200).send(getallEmp);
});

const editEmp = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const updateEmp = await user.findByIdAndUpdate(id, {isActive:false}, {
    new: true,
  });
  res.status(201).send(updateEmp)
});

const oneEmployeeDetails=asyncErrorHandler(async(req,res,next)=>{ 
  const { id } = req.params;
  const getEmp = await user.findById(id).select("-password");
  res.status(200).send(getEmp);
});


const userLog=asyncErrorHandler(async(req,res,next)=>{
  const userlogiin=await UserLog.create(req.body);
  res.status(201).json(userlogiin);
})

const allLog=asyncErrorHandler(async(req,res,next)=>{
  const allLog=await UserLog.find({}).populate("userId").select('-password')
  res.status(200).send(allLog);
})

export { addEmployee, allEmp,editEmp,oneEmployeeDetails,userLog,allLog};
