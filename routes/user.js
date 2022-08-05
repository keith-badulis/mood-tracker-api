const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const { validateUser } = require("../middleware/userValidation");

router.post("/login", userController.userLogin);
router.post("/logout", userController.userLogout);
router.post("/", userController.userPOST);
router.get("/:username", validateUser, userController.userGET);
router.put("/:username", validateUser, userController.userPUT);
router.delete("/:username", validateUser, userController.userDELETE);

module.exports = router;
