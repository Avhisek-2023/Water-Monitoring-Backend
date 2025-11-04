import mongoose from "mongoose";
import { ICountry } from "../interfaces/ICountry.js";

const countrySchema = new mongoose.Schema<ICountry>({
  name: { type: String, required: true },
  phone_code: { type: String },
  iso_code: { type: String },
});

const Country = mongoose.model<ICountry>("Country", countrySchema);

export default Country;
