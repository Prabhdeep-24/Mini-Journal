import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const EntrySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    content: {
      type: String,
      required: true
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false } 
  }
);

const Entry= mongoose.model('Entry', EntrySchema);
export default Entry;