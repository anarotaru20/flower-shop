const profileRepo = require("../repo/profile");

// async function getProfile(req, res, next) {
//   try {
//     const userId = req.user.id;

//     const profile = await profileRepo.getProfileById(userId);

//     if (!profile) {
//       return res.status(404).json({ message: "Profile not found" });
//     }

//     res.status(200).json(profile);
//   } catch (error) {
//     next(error);
//   }
// }

async function getProfile(req, res, next) {
  try {
    console.time("getProfile total")

    const userId = req.user.id

    console.time("profile query")
    const profile = await profileRepo.getProfileById(userId)
    console.timeEnd("profile query")

    if (!profile) {
      console.timeEnd("getProfile total")
      return res.status(404).json({ message: "Profile not found" })
    }

    console.timeEnd("getProfile total")

    res.status(200).json(profile)
  } catch (error) {
    console.timeEnd("getProfile total")
    next(error)
  }
}

async function updateProfile(req, res, next) {
  try {
    const userId = req.user.id
    const { username, first_name, last_name, birth_date, address } = req.body

    const updatedProfile = await profileRepo.updateProfileById(userId, {
      username,
      first_name,
      last_name,
      birth_date,
      address,
    })

    if (!updatedProfile) {
      return res.status(404).json({ message: 'Profile not found' })
    }

    res.status(200).json(updatedProfile)
  } catch (error) {
    next(error)
  }
}

const supabaseAdmin = require("../config/supabaseAdmin");

async function deleteAccount(req, res, next) {
  try {
    const userId = req.user.id;

    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    res.status(200).json({
      message: "Account deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProfile,
  updateProfile,
  deleteAccount,
};
