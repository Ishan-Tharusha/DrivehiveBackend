import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import user from "../model/userModel.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import { CustomError } from "../utils/customerError.js";
import sendEmail from "../utils/sendEmail.js";
import Payement from "../model/paymentModle.js";
import { createTransport } from "nodemailer";
const singToken = (id, name) => {
  return jwt.sign({ id, name }, process.env.JWT_SECRET, {
    expiresIn: "1hr",
  });
};

const registerUser = asyncErrorHandler(async (req, res, next) => {
  const { name, email, phoneNo, password } = req.body;

  const exits = await user.findOne({ email });
  if (exits) {
    const error = new CustomError("User Name already have", 404);
    return next(error);
  }

  bcrypt.genSalt(10, function (err, salt) {
    if (err) {
      const error = new CustomError("Hash error", 404);
      return next(error);
    }
    bcrypt.hash(password, salt, async function (err, hash) {
      if (err) {
        const error = new CustomError("Hash error", 404);
        return next(error);
      }
      // Store hash in your password DB.
      const userCreate = await user.create({
        name,
        email,
        phoneNo,
        password: hash,
        role: "user",
      });
      const token = jwt.sign(
        { userId: userCreate._id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      const url = `${process.env.BASE_URL}/user/${userCreate._id}/verify/${token}`;
      await sendEmail({
        name: userCreate.name,
        email: userCreate.email,
        subject: "Verify Email",
        pass: "", // Since you're passing an empty string
        url: url,
      });
      res
        .status(201)
        .send({ message: "An Email sent to your account please verify" });
    });
  });
  //create the user
});

const verifyGmail = asyncErrorHandler(async (req, res, next) => {
  try {
    const token = req.params.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Update user's verified status
    await user.findByIdAndUpdate(decoded.userId, { verified: true });

    res.send("Email successfully verified.");
  } catch (error) {
    res.status(400).send("Invalid or expired token.");
  }
});

const loginUser = asyncErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const userFind = await user.findOne({ email });
  if (!userFind) {
    const error = new CustomError("Invalid Credentials", 404);
    return next(error);
  }
  if (userFind && !userFind.verified) {
    const error = new CustomError("verifiy your email", 404);
    return next(error);
  }

  if (userFind && !userFind.isActive) {
    const error = new CustomError("Not Allowed to access", 404);
    return next(error);
  }

  bcrypt.compare(password, userFind.password, async function (err, result) {
    if (err) {
      const error = new CustomError("Internal Server Error", 500);
      return next(error);
    }
    if (result) {
      const newUser = await user.findOne({ email }).select("-password");
      const token = singToken(userFind._id, userFind.email);
      res.cookie("token", token, {
        httpOnly: true,
        // domain: 'localhost',
        path: "/",
        expires: new Date(Date.now() + 1000 * 86400),
        sameSite: "lax",
      }),
        res.status(200).json({ token, newUser });
    } else {
      const error = new CustomError("Invalid Credential", 500);
      return next(error);
    }
  });
});

const getUser = asyncErrorHandler(async (req, res, next) => {
  const userId = req.user;
  let newuser;

  try {
    newuser = await user.findById(userId, "-password");
  } catch (err) {
    const error = new CustomError("Login again..", 500);
    return next(error);
  }
  if (!newuser) {
    return res.status(404).json({ messsage: "User Not FOund" });
  }
  return res.status(200).json({ newuser });
});

// all details
const getAllUser = asyncErrorHandler(async (req, res, next) => {
  const alluser = await user
    .find({ role: { $ne: "admin" } })
    .select("-password");
  res.status(200).json(alluser);
});

//
const editUser = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const updateUser = await user.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  res.status(201).send(updateUser);
});

const logOutUser = asyncErrorHandler(async (req, res, next) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  }),
    res.status(200).json({ message: "log out" });
});

const forgot = asyncErrorHandler(async (req, res, next) => {
  const { email } = req.body;
  try {
    const foundUser = await user.findOne({ email }); // Corrected model name and variable name
    console.log(foundUser);
    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const token = jwt.sign({ _id: foundUser._id }, process.env.RESET_PASSWORD_KEY, {
      expiresIn: "30m",
    });
    // console.log(token);
    // Send email with password reset link
    const transporter = createTransport({
      host: 'smtp.ethereal.email', // Correct host for Gmail
      port: 587, // Common port for STARTTLS
      secure: false,
      service: 'gmail',
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });
    const mailOptions = {
      from: process.env.USER,
      to: email,
      subject: "Reset Password",
      html: `
          <h2>Please click on the link below to reset your password</h2>
          <p><a href="${process.env.BASE_URL}/reset-password/${token}">Reset Password</a></p>
        `,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "Error sending email" });
      } else {
        console.log("Email sent: " + info.response);
        return res.status(200).json({ message: "Email sent" });
      }
    });
  } catch (error) {
    next(error);
  }
});


const resetPass = asyncErrorHandler(async (req, res, next) => {
  const { token, password } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.RESET_PASSWORD_KEY);
    // console.log("Decoded Token:", decoded);
    const userId = decoded._id;
    const foundUser = await user.findById(userId); // Rename variable to foundUser
    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    foundUser.password = hashedPassword;
    await foundUser.save();
    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }
});


const updateuserStatus = asyncErrorHandler(async (req, res, next) => {
  const userStatus = await user.findByIdAndUpdate(
    req.params.id,
    {
      isActive: false,
    },
    { new: true }
  );
  res.json({ message: "ok", userStatus });
});

const getOrder = asyncErrorHandler(async (req, res, next) => {
  const id = req.params.id;
  const oneOrder = await Payement.find({ user: id });
  res.status(200).json(oneOrder);
});



export {
  registerUser,
  verifyGmail,
  loginUser,
  getAllUser,
  editUser,
  logOutUser,
  getUser,
  updateuserStatus,
  getOrder,
  forgot,
  resetPass
};
