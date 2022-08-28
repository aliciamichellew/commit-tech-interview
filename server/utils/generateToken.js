const jwt = require("jsonwebtoken");
const auth = require("../middlewares/authMiddleware");

const generateToken = (userId) => {
  // Gets expiration time
  const expiration = Math.floor(Date.now() / 1000) + 60 * 3600;
  // returns signed and encrypted token
  return auth.encrypt(
    jwt.sign(
      {
        data: {
          _id: userId,
        },
        exp: expiration,
      },
      process.env.JWT_SECRET
    )
  );
};

module.exports = generateToken;
