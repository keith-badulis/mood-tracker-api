const entryController = require("../controllers/entryController");

const express = require("express");
const router = express.Router({ mergeParams: true });

router.get("/", entryController.entriesGET);
router.post("/", entryController.entryPOST);

router.get("/:entryId", entryController.entryGET);
router.put("/:entryId", entryController.entryPUT);
router.delete("/:entryId", entryController.entryDELETE);

module.exports = router;
