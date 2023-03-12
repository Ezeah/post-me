const jwt = require("jsonwebtoken");
const User = require("./path/to/user/model");
const constants = require("../utilities/constants.utilities");

const authMiddleware = async (req, res, next) => {
    try {
      const token = req.header("Authorization").replace("Bearer ", "");
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findOne({ _id: decoded._id, "tokens.token": token });
      if (!user) {
        throw new Error("Unauthorized access");
      }
      req.token = token;
      req.user = user;
      next();
    } catch (error) {
      res.status(401).send({ error: error.message });
    }
  };

