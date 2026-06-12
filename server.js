const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const auth = require("./middleware/auth");

const Customer = require("./models/Customer");
const Transaction = require("./models/Transaction");

const app = express();

/* ✅ CORS FIX */
app.use(cors());
/* ✅ Middleware */
console.log("✅ NEW BACKEND CODE DEPLOYED");
app.use(express.json());

/* ✅ Routes */
app.use("/api/auth", authRoutes);

/* ✅ MongoDB */
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log(err));

/* ✅ Test Route */
app.get("/", (req, res) => {
  res.send("Backend running ✅");
});

/* ✅ Add Customer */
app.post("/customers", auth, async (req, res) => {
  try {
    const { name, phone, village } = req.body;

    const newCustomer = new Customer({
      name,
      phone,
      village,
      userId: req.user.userId
    });

    await newCustomer.save();
    res.json(newCustomer);
  } catch (err) {
    console.log(err);  // ✅ DEBUG
    res.status(500).json({ error: "Error adding customer" });
  }
});

/* ✅ Get Customers */
app.get("/customers", auth, async (req, res) => {
  try {
    const customers = await Customer.find({
      userId: req.user.userId
    });

    res.json(customers);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error fetching customers" });
  }
});

/* ✅ Delete Customer */
app.delete("/customers/:id", auth, async (req, res) => {
  try {
    const customerId = req.params.id;

    await Customer.findByIdAndDelete(customerId);

    await Transaction.deleteMany({
      customerId: customerId.toString()
    });

    res.json({ message: "Customer + transactions deleted ✅" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Delete failed" });
  }
});

/* ✅ Add Transaction */
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
      userId: req.user.userId
    });

    await newTx.save();
    res.json(newTx);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to add transaction" });
  }
});

/* ✅ Get Transactions */
app.get("/transactions", auth, async (req, res) => {
  try {
    const txs = await Transaction.find({
      userId: req.user.userId
    });

    res.json(txs);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error fetching transactions" });
  }
});

/* ✅ ✅ PORT FIX (MOST IMPORTANT) */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});