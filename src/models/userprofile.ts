import mongoose, { Query, Schema } from "mongoose";
import { IUserProfile } from "../interfaces/IUserProfile.js";

const userProfileSchema = new mongoose.Schema<IUserProfile>({
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  dob: { type: Date },
  address_id: { type: Schema.Types.ObjectId, ref: "Address" },
  contact_id: { type: Schema.Types.ObjectId, ref: "Contact" },
  profileUrl: { type: String },
});

userProfileSchema.pre(/^find/, function (next) {
  const query = this as Query<any, any>;
  query.populate("address_id").populate("contact_id");
  next();
});

const UserProfile = mongoose.model<IUserProfile>(
  "UserProfile",
  userProfileSchema
);

export default UserProfile;
