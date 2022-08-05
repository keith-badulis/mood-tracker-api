module.exports.validateUser = function (req, res, next) {
  const token = req.header["Authorization"];

  console.log(token);
  console.log(global.tokens[token]);

  next();
};
