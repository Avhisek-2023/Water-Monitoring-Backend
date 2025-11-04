import mongoose, { Types } from "mongoose";

export interface IState extends Document {
  name: string;
  code: string;
  country_id: Types.ObjectId;
  gst_code?: string;
}
