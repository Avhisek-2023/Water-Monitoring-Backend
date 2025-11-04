import mongoose, { Schema } from "mongoose";
import { IState } from "../interfaces/IState.js";

const stateSchema = new mongoose.Schema<IState>(
  {
    name: { type: String, required: true },
    code: { type: String, required: true },
    country_id: { type: Schema.Types.ObjectId, ref: "Country", required: true },
    gst_code: { type: String },
  },
  { timestamps: true }
);

const State = mongoose.model<IState>("State", stateSchema);

export default State;
