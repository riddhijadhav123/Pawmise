require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Razorpay = require('razorpay');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  dbName: 'pawmise',
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Routes
app.use('/api/visits', require('./routes/visit'));
app.use('/api/board', require('./routes/board'));
app.use('/api', require('./routes/auth'));
// Razorpay Initialization
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,     // Use .env for safety!
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Payment Route
app.post('/api/payment/orders', async (req, res) => {
  try {
    const options = {
      amount: req.body.amount * 100,          // Amount in paise
      currency: "INR",
      receipt: `receipt_order_${Math.random()}`,
    };
    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Server Listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));