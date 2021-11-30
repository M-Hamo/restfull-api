const User = require("../models/registerModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const getAllUsers = async (req, res) => {
  try {
    let users = await User.find();

    return res.status(200).json(users);
  } catch (err) {
    return res.status(400).json({ message: err.message, status: 1 });
  }
};

const addNewUser = async (req, res) => {
  const { userName, password: plainTextPassword } = req.body;

  if (!userName || typeof userName !== "string")
    return res.json({ message: "Invalid user name", state: 1 });
  if (!plainTextPassword || typeof plainTextPassword !== "string")
    return res.json({ message: "Invalid Password", state: 1 });
  // Hashing password
  const password = await bcrypt.hash(plainTextPassword, 10);
  try {
    const newUser = await User.create({
      userName,
      password,
    });

    return newUser
      ? res.status(200).json({ message: "user created", status: 0 })
      : res.status(404).json({ message: "not found", status: 1 });
  } catch (err) {
    return err.code === 11000
      ? res
          .status(400)
          .json({ message: "user name is already user", status: 1 })
      : res.status(400).json({ message: err.message, status: 1 });
  }
};

const login = async (req, res) => {
  const { userName, password } = req.body;
  const user = await User.findOne({ userName }).lean();
  user ?? res.json({ message: "Uncorrected username or password", state: 1 });
  const JWT_SECRET = "_yEXQGNwOdcwGOe-3-8nilhsO8rsYIHv6oiJmdQvKHQ";
  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign(
      { id: user._id, userName: user.userName },
      JWT_SECRET
    );

    res.json({
      message: "login successfully",
      state: 0,
      user,
      token,
    });
  }
  res.json({ message: "Uncorrected username or password", state: 1 });
};

const changePass = async (req, res) => {
  const {
    token,
    oldPassword: plainTextOldPassword,
    newPassword: plainTextPassword,
  } = req.body;
  const JWT_SECRET = "_yEXQGNwOdcwGOe-3-8nilhsO8rsYIHv6oiJmdQvKHQ";
  if (!plainTextPassword || typeof plainTextPassword !== "string")
    return res.json({ message: "Invalid Password", state: 1 });

  try {
    // return payload section
    const user = await jwt.verify(token, JWT_SECRET);
    const userId = user.id;
    const userName = user.userName;

    const ourUser = await User.findOne({ userName }).lean();
    // validate for old password
    if (await bcrypt.compare(plainTextOldPassword, ourUser.password)) {
      const password = await bcrypt.hash(plainTextPassword, 10);

      await User.updateOne({ _id: userId }, { $set: { password } });
      res.json({ message: "password updated successfully", state: 0 });
    }
    res.json({ message: "Old password is Uncorrected", state: 1 });
  } catch (err) {
    return res.status(400).json({ message: err.message, status: 1 });
  }
};

const getUser = async (req, res) => {
  let userId = req.params.userId;
  try {
    let user = await User.findById(userId);
    return user
      ? res.status(200).json(user)
      : res.status(404).json({ message: "not found", status: 1 });
  } catch (err) {
    return res.status(400).json({ message: err.message, status: 1 });
  }
};

const deleteUser = async (req, res) => {
  let userId = req.params.userId;
  try {
    let user = await User.deleteOne({ _id: userId });

    const { deletedCount } = user;

    return deletedCount === 0
      ? res
          .status(404)
          .json({ message: "user not found for deleting", state: 1 })
      : res.status(200).json({ message: "user removed", state: 0 });
  } catch (err) {
    return res.status(400).json({ message: err.message, status: 1 });
  }
};

const updateUser = async (req, res) => {
  let userId = req.params.userId;
  try {
    await User.updateOne({ _id: userId }, req.body);

    return res.status(200).json({ message: "user updated", state: 0 });
  } catch (err) {
    return res.status(400).json({ message: err.message, status: 1 });
  }
};

module.exports = {
  addNewUser,
  login,
  getAllUsers,
  getUser,
  deleteUser,
  updateUser,
  changePass,
};
