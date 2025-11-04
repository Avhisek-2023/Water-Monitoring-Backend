import { Request, Response } from "express";
import { ResponseApi } from "../GlobalResponse/Response.js";
import Address from "../models/addresses.js";
import mongoose from "mongoose";
import UserProfile from "../models/userprofile.js";
import { log } from "console";

export const saveAddress = async (req: Request, res: Response) => {
  try {
    // console.log(req.body);

    const {
      line1 = "",
      line2 = "",
      landmark = "",
      city = "",
      state_id = null,
      country_id = null,
      postal_code = "",
      latitude = 0,
      longitude = 0,
    } = req.body;

    const address = new Address({
      line1,
      line2,
      landmark,
      city,
      state_id: state_id ? new mongoose.Types.ObjectId(state_id) : null,
      country_id: country_id ? new mongoose.Types.ObjectId(country_id) : null,
      postal_code,
      latitude,
      longitude,
    });

    await address.save();

    const userprofile = await UserProfile.findOne({
      user_id: req.user?.userID,
    });

    if (userprofile) {
      userprofile.address_id = address._id;
      await userprofile.save();
    }

    log("Address saved:", address);

    const populatedAddress = await Address.findById(address._id)
      .populate("state_id")
      .populate("country_id");

    console.log("Populated Address:", populatedAddress);

    return res.status(200).json(
      ResponseApi.success(200, "Address saved successfully", {
        address: populatedAddress,
      })
    );
  } catch (error) {
    log("Error saving address:", error);
    ``;
    return res
      .status(500)
      .json(ResponseApi.error(500, (error as string) || "Server Error"));
  }
};
