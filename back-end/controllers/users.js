const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/users");
const asyncHabdler = require("express-async-handler");
const registerUser = asyncHabdler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("please add all field");
  }
  const userExist = await User.findOne({ email });
  if (userExist) {
    res.status(400);
    throw new Error("user already exist");
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = await User.create({
    name: name,
    email: email,
    password: hashedPassword,
  });
  if (newUser) {
    return res.status(201).json({ newUser, token: generateToken(newUser._id) });
  }
  res.status(400);
  throw new Error("invalid user data");
});

const loginUser = asyncHabdler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!email) {
    res.status(400);
    throw new Error("email does not exist");
  }
  const checkPassword = await bcrypt.compare(password, user.password);
  if (!checkPassword) {
    res.status(400);
    throw new Error("password not good");
  } else {
    const token = generateToken(user._id);
    res.status(200).json({ token });
  }
});

const getMe = asyncHabdler(async (req, res) => {
    const {_id,name,email}= await User.findById(req.user.id)
  res.status(200).json({ id:_id,name,email});
});
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};
module.exports = {
  registerUser,
  loginUser,
  getMe,
};
