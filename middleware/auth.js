const { StatusCodes, getReasonPhrase } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const UnAuthorizedError = require('../errors/unauthorized-err');


const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer')) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .send({ message: getReasonPhrase(StatusCodes.UNAUTHORIZED) })
  }
  const token = authorization.replace('Bearer ', '');
  const secretKeyDev = '916cd609990dec8e0bd7827cb0844d44487643c8d4101b80d2c6cbb34440af6c';
  let payload;
  try {
    payload = jwt.verify(token, secretKeyDev);
  } catch (err) {
    const error = new UnAuthorizedError('Authorization required');
    next(error);
  }
  req.user = payload;
  next();
};

module.exports = auth;
