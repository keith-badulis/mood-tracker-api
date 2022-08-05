const jwt = require("jsonwebtoken");

module.exports.validateUser = function (req, res, next) {
  const token = req.headers.authorization;
  const currTime = new Date().getTime();
  const tokenCreatedTime = global.tokens[token];

  try {
    const decoded = jwt.verify(token, "secret");
    console.log("valid?")
    next();
  } catch (error) {
    console.log(error);
    if (error instanceof jwt.JsonWebTokenError)
      res.send(401).end();
    else
      res.send(500).end();
  }
};
