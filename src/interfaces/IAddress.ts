import { Types } from "mongoose";

export interface IAddress extends Document {
  line1?: string;
  line2?: string;
  landmark?: string;
  city?: string;
  state_id?: Types.ObjectId;
  country_id?: Types.ObjectId;
  postal_code?: string;
  latitude?: number;
  longitude?: number;
}
