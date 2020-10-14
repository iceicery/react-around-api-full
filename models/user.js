const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        const regex = /^https?:\/\/(www.)?([A-Za-z0-9\-._~:/?#[\]@!$&'()*+,;=](%[0-9a-fA-F]{2})?)+\.+([A-Za-z0-9\-._~:/?#[\]@!$&'()*+,;=](%[0-9a-fA-F]{2})?)+$/gi;
        return regex.test(v);
      },
      message: 'please enter a link.',
    },
  },
});

module.exports = mongoose.model('user', userSchema);
