const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,   
  },
  name: String,
phone: {
  type: String,
  required: true,
  unique: true
}
,
  village: String
});

module.exports = mongoose.model("Customer", customerSchema);
