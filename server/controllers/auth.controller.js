import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  if (
    !email ||
    !password ||
    !username ||
    username === "" ||
    password === "" ||
    email === ""
  ) {
    next(errorHandler(400, "Missing fields"));
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });
  try {
    await newUser.save();
    res.json("Signed up successfully!");
  } catch (err) {
    next(err);
  }
};
