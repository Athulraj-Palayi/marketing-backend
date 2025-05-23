import mongoose from 'mongoose';

const ContactSchema = new mongoose.Schema({
  name: String,
  number: String,
  category: String
});

export default mongoose.model('Contact', ContactSchema);
