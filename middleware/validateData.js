const { celebrate, Joi } = require('celebrate');

function validateProfile() {

}

function validateAvatar() {

}

function validateUser() {
  return celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
      avatar: Joi.string().required().regex(/^https?:\/\/(www.)?([A-Za-z0-9\-._~:/?#[\]@!$&'()*+,;=](%[0-9a-fA-F]{2})?)+\.+([A-Za-z0-9\-._~:/?#[\]@!$&'()*+,;=](%[0-9a-fA-F]{2})?)+$/),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  });
}

function validateLogin() {

}

function validateCards() {

}

module.exports = {
  validateProfile, validateAvatar, validateUser, validateLogin, validateCards,
};
