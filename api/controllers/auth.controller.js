import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    username === '' ||
    email === '' ||
    password === ''
  ) {
    next(errorHandler(400, 'All fields are required'));
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.json('Signup successful');
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === '' || password === '') {
    next(errorHandler(400, 'All fields are required'));
  }

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, 'User not found'));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, 'Invalid password'));
    }
    const token = jwt.sign(
      { id: validUser._id, isAdmin: validUser.isAdmin },
      process.env.JWT_SECRET
    );

    const { password: pass, ...rest } = validUser._doc;

    res
      .status(200)
      .cookie('access_token', token, {
        httpOnly: true,
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};

/* GOOGLE AUTH */
export const google = async (req, res) => {
  const { email, name, googlePhotoUrl } = req.body;

  try {
    /* Check if user exists */
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      /* Generate JWT token */
      const token = jwt.sign({ id: existingUser._id, isAdmin: existingUser.isAdmin }, process.env.JWT_SECRET);
      const { password, ...userWithoutPassword } = existingUser._doc;

      res
        .status(200)
        .cookie("access_token", token, { httpOnly: true })
        .json(userWithoutPassword);
    } else {
      /* Generate a random password */
      const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const hashedPassword = await bcryptjs.hash(generatedPassword, 10);

      /* Create a new User */
      const newUser = new User({
        username: name.toLowerCase().split(" ").join("") + Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });

      /* Save the new User */
      await newUser.save();

      /* Generate JWT token */
      const token = jwt.sign({ id: newUser._id, isAdmin: newUser.isAdmin }, process.env.JWT_SECRET);
      const { password, ...userWithoutPassword } = newUser._doc;

      res
        .status(200)
        .cookie("access_token", token, { httpOnly: true })
        .json(userWithoutPassword);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Google authentication failed!", error: error.message });
  }
};