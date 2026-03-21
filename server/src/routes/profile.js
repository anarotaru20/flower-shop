const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const profileController = require("../controllers/profile");

router.get("/profile", auth, profileController.getProfile);
router.put("/profile", auth, profileController.updateProfile);
router.delete("/profile", auth, profileController.deleteAccount);

module.exports = router;