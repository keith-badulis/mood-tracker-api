const jwt = require("jsonwebtoken");

module.exports.validateUser = function (req, res, next) {
  const token = req.headers.authorization;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    console.log(error);
    if (error instanceof jwt.JsonWebTokenError) res.send(401).end();
    else res.send(500).end();
  }
};
