import mongoose, { Schema, Document } from "mongoose";
import crypto from "crypto";

export interface ITrainer extends Document {
  email: string;
  name: string;
  passwordHash: string;
  createdAt: Date;
}

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

const TrainerSchema = new Schema<ITrainer>(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

// Static helper to verify password
TrainerSchema.statics.hashPassword = hashPassword;

const Trainer = mongoose.model<ITrainer>("Trainer", TrainerSchema);

export { hashPassword };
export default Trainer;
