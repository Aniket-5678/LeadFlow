
import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Lead name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            trim: true,
            lowercase: true,
        },
        phone: {
            type: String,
            required: [true, "Phone number is required"],
            trim: true,
        },
        company: {
            type: String,
            trim: true,
            default: "",
        },
        source: {
            type: String,
            required: [true, "Lead source is required"],
            enum: ["Website", "Referral", "Social Media", "Other"],
        },
        status: {
            type: String,
            enum: ["New", "Contacted", "Qualified", "Lost"],
            default: "New",
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

const Lead = mongoose.model("Lead", leadSchema);

export default Lead;
