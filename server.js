import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './db.js';

import User from './models/user.js';
import Contact from './models/contact.js';
import Category from './models/category.js';

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Add a test route
app.get('/', (req, res) => {
  res.send('✅ Server is running');
});

// === USER ROUTE EXAMPLE ===
app.post('/add-user', async (req, res) => {
  const { name, email } = req.body;
  const user = new User({ name, email });
  await user.save();
  res.json(user);
});

// === CONTACT ROUTES ===
app.post('/add-contact', async (req, res) => {
  const { name, number, category } = req.body;
  const contact = new Contact({ name, number, category });
  await contact.save();
  res.json(contact);
});

app.get('/contacts', async (req, res) => {
  const contacts = await Contact.find();
  res.json(contacts);
});

// === CATEGORY ROUTES ===
app.post('/add-category', async (req, res) => {
  const { name } = req.body;
  const category = new Category({ name });
  await category.save();
  res.json(category);
});

app.get('/categories', async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
});

// === START SERVER ===
app.listen(3000, () => {
  console.log('✅ Server running on http://localhost:3000');
});
