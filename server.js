import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db.js';
import User from './models/user.js'; // this file will be created now

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.post('/add-user', async (req, res) => {
  const { name, email } = req.body;
  const user = new User({ name, email });
  await user.save();
  res.json(user);
});

app.listen(3000, () => {
  console.log('✅ Server running on http://localhost:3000');
});
