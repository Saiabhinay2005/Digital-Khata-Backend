const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },

  /* ✅ ADD THIS */
  name: {
    type: String,
    required: true   // ✅ shop name must be entered
  }

});

module.exports = mongoose.model("User", userSchema);
