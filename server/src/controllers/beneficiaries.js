const repo = require("../repo/beneficiaries");

async function getBeneficiaries(req, res, next) {
  try {
    const userId = req.user.id;

    const data = await repo.getBeneficiariesByUserId(userId);

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
}

async function createBeneficiary(req, res, next) {
  try {
    const userId = req.user.id;

    const payload = {
      ...req.body,
      user_id: userId,
    };

    const data = await repo.createBeneficiary(payload);

    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
}

async function updateBeneficiary(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const data = await repo.updateBeneficiaryById(
      id,
      userId,
      req.body
    );

    if (!data) {
      return res.status(404).json({ message: "Beneficiary not found" });
    }

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
}

async function deleteBeneficiary(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    await repo.deleteBeneficiaryById(id, userId);

    res.status(200).json({ message: "Beneficiary deleted" });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getBeneficiaries,
  createBeneficiary,
  updateBeneficiary,
  deleteBeneficiary,
};