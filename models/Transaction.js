const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  customerId: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true  // "KHATA" or "PAYMENT"
  },
  amount: {
    type: Number,
    required: true
  },
  items: String,
  remarks: String,
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Transaction", transactionSchema);