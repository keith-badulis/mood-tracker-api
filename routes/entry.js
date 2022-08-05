const express = require("express");
const router = express.Router({ mergeParams: true });

const entryController = require("../controllers/entryController");

router.get("/", entryController.entriesGET);
router.post("/", entryController.entryPOST);

router.get("/calendarmarks", entryController.entriesCalendarMarksGET)

router.get("/:entryId", entryController.entryGET);
router.put("/:entryId", entryController.entryPUT);
router.delete("/:entryId", entryController.entryDELETE);

module.exports = router;
