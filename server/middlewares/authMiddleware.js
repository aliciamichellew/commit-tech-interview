const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");
const crypto = require("crypto");
const secret = process.env.JWT_SECRET;
const algorithm = "aes-192-cbc";
const key = crypto.scryptSync(String(secret), "salt", 24);
const iv = Buffer.alloc(16, 0);

const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        token = req.headers.authorization.split(" ")[1];

        //decodes token id
        const decoded = await getUserIdFromToken(token);

        req.user = await User.findById(decoded).select("-password");

        next();
      } catch (error) {
        res.status(401);
        throw new Error("Not authorized, token failed");
      }
    }

    if (!token) {
      res.status(401);
      throw new Error("Not authorized, no token");
    }
  } catch (error) {
    res.json(error);
  }
};

const encrypt = (text) => {
  const cipher = crypto.createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  return encrypted;
};

/**
 * Decrypts text
 * @param {string} text - text to decrypt
 */

const decrypt = (text) => {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);

  try {
    let decrypted = decipher.update(text, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (err) {
    return err;
  }
};

const getUserIdFromToken = async (token) => {
  return new Promise((resolve, reject) => {
    // Decrypts, verifies and decode token
    jwt.verify(decrypt(token), process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        res.status(409);
        throw new Error("Bad Token");
        // reject(buildErrorObject(409, "BAD_TOKEN"));
      }
      resolve(decoded.data._id);
    });
  });
};

module.exports = {
  protect,
  getUserIdFromToken,
  encrypt,
  decrypt,
};
