import mongoose, { Query } from "mongoose";
import { IAddress } from "../interfaces/IAddress.js";
import "../models/states.js";
import "../models/countries.js";

const addressSchema = new mongoose.Schema<IAddress>(
  {
    line1: { type: String },
    line2: { type: String },
    landmark: { type: String },
    city: { type: String },
    state_id: { type: mongoose.Schema.Types.ObjectId, ref: "State" },
    country_id: { type: mongoose.Schema.Types.ObjectId, ref: "Country" },
    postal_code: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
  },
  { timestamps: true }
);

addressSchema.pre(/^find/, function (next) {
  const query = this as Query<any, any>;
  query.populate("state_id").populate("country_id");
  next();
});

const Address = mongoose.model<IAddress>("Address", addressSchema);
export default Address;
