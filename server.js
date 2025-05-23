import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; // <-- Add this
import connectDB from './db.js';
import User from './models/user.js';

dotenv.config();
connectDB();

const app = express();
app.use(cors()); // <-- And this
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
