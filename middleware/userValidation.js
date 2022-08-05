module.exports.validateUser = function (req, res, next) {
  const token = req.headers.authorization;
  const currTime = new Date().getTime();
  const tokenCreatedTime = new Date(global.tokens[token]).getTime();

  global.tokens[token] && currTime - tokenCreatedTime < 1000 * 60 * 60 * 2
    ? next()
    : res.status(401).end();
};
