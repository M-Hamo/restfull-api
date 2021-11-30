const User = require("../models/userModel");

const getAllUsers = async (req, res) => {
  try {
    let users = await User.find();

    return res.status(200).json(users);
  } catch (err) {
    return res.status(400).json({ message: err.message, status: 1 });
  }
};

const addNewUser = async (req, res) => {
  try {
    let newUser = await new User(req.body);

    newUser.save((err, done) => {
      if (err) return res.status(400).send({ message: err.message, status: 1 });
      else return res.status(201).send({ message: "user created", status: 0 });
    });
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
  getAllUsers,
  getUser,
  deleteUser,
  updateUser,
};
