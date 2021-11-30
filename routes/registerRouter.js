const express = require("express");
const registerController = require("../controllers/registerController");

const router = express.Router();
router.get("/", registerController.getAllUsers);
router.post("/", registerController.addNewUser);
router.post("/login", registerController.login);
router.post("/changePassword", registerController.changePass);
router.get("/:userId", registerController.getUser);
router.delete("/:userId", registerController.deleteUser);
router.put("/:userId", registerController.updateUser);

module.exports = router;
