import mongoose from "mongoose";
import { IContact } from "../interfaces/IContact.js";

const contactSchema = new mongoose.Schema<IContact>({
  phone: { type: String, required: true },
  alternatePhone: { type: String },
  emergencyContactNo: { type: String },
});

const Contact = mongoose.model<IContact>("Contact", contactSchema);

export default Contact;
