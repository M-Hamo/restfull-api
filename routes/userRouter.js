const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

router.get("/", userController.getAllUsers);
router.post("/", userController.addNewUser);
router.get("/:userId", userController.getUser);
router.delete("/:userId", userController.deleteUser);
router.put("/:userId", userController.updateUser);

module.exports = router;
