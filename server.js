const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios"); // ✅ NEW

require("dotenv").config();
const Customer = require("./models/Customer");
const Transaction = require("./models/Transaction");

const app = express();

app.use(cors());
app.use(express.json());

/* ✅ Connect MongoDB */
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log(err));

/* ✅ Test */
app.get("/", (req, res) => {
  res.send("Backend running ✅");
});

/* ✅ Add Customer */
app.post("/customers", async (req, res) => {
  try {
    const { name, phone, village } = req.body;
    const newCustomer = new Customer({ name, phone, village });

    await newCustomer.save();
    res.json(newCustomer);
  } catch (err) {
    res.status(500).json({ error: "Error adding customer" });
  }
});

/* ✅ Get Customers */
app.get("/customers", async (req, res) => {
  const customers = await Customer.find();
  res.json(customers);
});

/* ✅ Delete */
app.delete("/customers/:id", async (req, res) => {
  try {
    const customerId = req.params.id;

    await Customer.findByIdAndDelete(customerId);

    await Transaction.deleteMany({
      customerId: customerId.toString()
    });

    res.json({ message: "Customer + transactions deleted ✅" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});

/* ✅ Add Transaction */
app.post("/transactions", async (req, res) => {
  try {
    const { customerId, type, amount, items, remarks, date } = req.body;

    const newTx = new Transaction({
      customerId: customerId.toString(),
      type,
      amount,
      items,
      remarks,
      date
    });

    await newTx.save();
    res.json(newTx);
  } catch (err) {
    res.status(500).json({ error: "Failed to add transaction" });
  }
});

/* ✅ Get Transactions */
app.get("/transactions", async (req, res) => {
  const txs = await Transaction.find();
  res.json(txs);
});





/* ✅ Server */
app.listen(5000, () => {
  console.log("Server running on port 5000");
});