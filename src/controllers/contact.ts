import { Request, Response } from "express";
import Contact from "../models/contacts.js";
import UserProfile from "../models/userprofile.js";
import { ResponseApi } from "../GlobalResponse/Response.js";

export const saveContact = async (req: Request, res: Response) => {
  try {
    const {
      phone,
      alternatePhone = null,
      emergencyContactNo = null,
    } = req.body;

    const contact = new Contact({
      phone,
      alternatePhone,
      emergencyContactNo,
    });

    await contact.save();
    const user_id = req.user?.userID;

    const profile = await UserProfile.findOne({ user_id });
    if (profile) {
      profile.contact_id = contact._id;
      await profile.save();
    }

    return res
      .status(200)
      .json(
        ResponseApi.success(200, "Contact saved successfully", { contact })
      );
  } catch (error) {
    return res
      .status(500)
      .json(ResponseApi.error(500, "Internal Server Error"));
  }
};
