const userController = require("../controllers/userController");

const express = require("express");
const router = express.Router();

const { validateUser } = require("./middleware/userValidation");

router.post("/login", userController.userLogin);
router.post("/logout", userController.userLogout);
router.post("/", userController.userPOST);
router.get("/:username", userController.userGET);
router.put("/:username", userController.userPUT);
router.delete("/:username", userController.userDELETE);

module.exports = router;
