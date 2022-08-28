const User = require("../models/userModel");
const generateToken = require("../utils/generateToken");

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

module.exports = {
  registerUser,
  authUser,
};
