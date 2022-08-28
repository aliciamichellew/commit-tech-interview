const express = require("express");
const {
  registerUser,
  authUser,
  getUserProfile,
  updateUserProfile,
  uploadProfilePic,
} = require("../controllers/userControllers");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");

router.route("/").post(registerUser);
router.route("/login").post(authUser);
router.route("/getprofile/:userId").get(protect, getUserProfile);
router.route("/editprofile").put(protect, updateUserProfile);
router.route("/uploadprofilepic").post(uploadProfilePic);

module.exports = router;
