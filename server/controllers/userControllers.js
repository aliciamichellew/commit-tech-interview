const User = require("../models/userModel");
const generateToken = require("../utils/generateToken");
const cloudinary = require("../cloudinary/cloudinary");

const isUserExist = async (email) => {
  const user = await User.findOne({ email });

  return user ? true : false;
};

const registerUser = async (req, res) => {
  try {
    console.log("masuk backend");
    const { name, email, password, dateOfBirth } = req.body;

    if (await isUserExist(email)) {
      res.status(400).send({ message: "User already exist" });
      return;
    }

    //insert data into user database
    const user = await User.create({
      name,
      email,
      password,
      dateOfBirth,
    });

    if (user) {
      const token = generateToken(user._id);
      console.log("user = ", user);
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        dateOfBirth: user.dateOfBirth,
        password: user.password,
        token: generateToken(user._id),
      });

      return;
    } else {
      User.findOneAndDelete({ email });
      Profile.findOneAndDelete({ email });
      res
        .status(400)
        .send({ message: "Error occured when creating user and profile" });
      return;
    }
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .send({ message: "Error occured when creating user and profile" });
  }
};

const authUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        dateOfBirth: user.dateOfBirth,
        token: generateToken(user._id),
      });
      return;
    } else {
      res.status(400);
      throw new Error("Invalid Email or Password!");
    }
  } catch (error) {
    console.log(error);
    response.status(400).send({ message: "Error occured when auth user" });
    return;
  }
};

const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({
      _id: userId,
    });
    res.json(user);
    return;
  } catch (error) {
    res
      .status(400)
      .send({ message: "Error occured when getting user profile" });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const newProfile = req.body.profile;

    // Disallow user to update email and username of profile
    if (newProfile.hasOwnProperty("email")) {
      res.status(400).send({ message: "Cannot update email" });
      return;
    }

    const profile = await User.findOneAndUpdate(
      {
        _id: req.user._id,
      },
      newProfile,
      { new: true }
    );

    res.status(200).send({ message: "Update status success" });
    return;
  } catch (err) {
    res.status(400).send({ message: "Error occured when updating user" });
    return;
  }
};

const uploadProfilePic = async (req, res) => {
  console.log("masuk");
  const { image } = req.body;
  const uploadedImage = await cloudinary.uploader.upload(
    image,
    {
      upload_preset: "headquarter_profile",
      allowed_formats: ["png", "jpg", "jpeg", "svg", "ico", "jfif", "webp"],
    },
    function (error, result) {
      if (error) {
        console.log(error);
      }
      // console.log(result);
    }
  );
  try {
    res.status(200).json(uploadedImage);
    return;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  registerUser,
  authUser,
  getUserProfile,
  updateUserProfile,
  uploadProfilePic,
};
