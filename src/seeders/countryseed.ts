import mongoose from "mongoose";
import Country from "../models/countries.js";

const countries = [
  {
    name: "India",
    phone_code: "+91",
    iso_code: "IN",
  },
];

async function seed() {
  try {
    await mongoose.connect(
      process.env.DB_URL ||
        "mongodb+srv://root:ch5fasqomYJNKL0I@cluster0.u3qt819.mongodb.net/?appName=Cluster0"
    );

    await Country.insertMany(countries);

    console.log("✅ All Indian countries inserted successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error inserting countries:", err);
    process.exit(1);
  }
}

seed();

// 69099f1c4d67ae9e4b818b63
