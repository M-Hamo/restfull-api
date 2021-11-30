const User = require("../models/userModel");

const getAllUsers = () => {
  return User.find({});
};

const insertNewUser = (user) => {
  let newUser = new User(user);
  return newUser.save();
};

module.exports = {
  getAllUsers,
  insertNewUser,
};
