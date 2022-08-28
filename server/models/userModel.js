const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userTemplate = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  profilePic: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

userTemplate.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userTemplate.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userTemplate.pre("findOneAndUpdate", async function (next) {
  if (!this._update.password) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this._update.password = await bcrypt.hash(this._update.password, salt);
});

const User = mongoose.model("users", userTemplate);

module.exports = User;
