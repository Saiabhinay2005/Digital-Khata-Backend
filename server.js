const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const auth = require("./middleware/auth");

const Customer = require("./models/Customer");
const Transaction = require("./models/Transaction");

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Auth routes
app.use("/api/auth", authRoutes);

/* ✅ Connect MongoDB */
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log(err));

/* ✅ Test */
app.get("/", (req, res) => {
  res.send("Backend running ✅");
});

/* ✅ Add Customer (PROTECTED) */
app.post("/customers", auth, async (req, res) => {
  try {
    const { name, phone, village } = req.body;

    const newCustomer = new Customer({
      name,
      phone,
      village,
      userId: req.user.userId   // ✅ attach user
    });

    await newCustomer.save();
    res.json(newCustomer);
  } catch (err) {
    res.status(500).json({ error: "Error adding customer" });
  }
});

/* ✅ Get Customers (PROTECTED + FILTERED) */
app.get("/customers", auth, async (req, res) => {
  const customers = await Customer.find({
    userId: req.user.userId   // ✅ filter per user
  });

  res.json(customers);
});

/* ✅ Delete Customer (PROTECTED) */
app.delete("/customers/:id", auth, async (req, res) => {
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

/* ✅ Add Transaction (PROTECTED) */
app.post("/transactions", auth, async (req, res) => {
  try {
    const { customerId, type, amount, items, remarks, date } = req.body;

    const newTx = new Transaction({
      customerId: customerId.toString(),
      type,
      amount,
      items,
      remarks,
      date,
      userId: req.user.userId   // ✅ attach user
    });

    await newTx.save();
    res.json(newTx);
  } catch (err) {
    res.status(500).json({ error: "Failed to add transaction" });
  }
});

/* ✅ Get Transactions (PROTECTED + FILTERED) */
app.get("/transactions", auth, async (req, res) => {
  const txs = await Transaction.find({
    userId: req.user.userId   // ✅ filter
  });

  res.json(txs);
});

/* ✅ Server */
app.listen(5000, () => {
  console.log("Server running on port 5000");
});