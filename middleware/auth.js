const { StatusCodes, getReasonPhrase } = require('http-status-codes');
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer')) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .send({ message: getReasonPhrase(StatusCodes.UNAUTHORIZED) })
  }
  const token = authorization.replace('Bearer', '');
  let payload;
  try {
    payload = jwt.verify(token, 'some-key');
  }
  catch (err) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .send({ message: getReasonPhrase(StatusCodes.UNAUTHORIZED) })
  }
  req.user = payload;
  next();
}

module.exports = auth;