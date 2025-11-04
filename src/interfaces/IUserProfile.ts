import { Types } from "mongoose";

export interface IUserProfile extends Document {
  user_id: Types.ObjectId;
  name: string;
  email: string;
  dob?: Date;
  address_id?: Types.ObjectId;
  contact_id?: Types.ObjectId;
  profileUrl?: string;
}
