const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
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
  owner: {
    type: Object,
    required: true,
  },
  likes: {
    type: Array,
    default: [],
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
