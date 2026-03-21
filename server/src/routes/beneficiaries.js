const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const beneficiariesController = require("../controllers/beneficiaries");

router.get("/beneficiaries", auth, beneficiariesController.getBeneficiaries);
router.post("/beneficiaries", auth, beneficiariesController.createBeneficiary);
router.put("/beneficiaries/:id", auth, beneficiariesController.updateBeneficiary);
router.delete("/beneficiaries/:id", auth, beneficiariesController.deleteBeneficiary);

module.exports = router;