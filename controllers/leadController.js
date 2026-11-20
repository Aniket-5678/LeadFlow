
import Lead from "../models/leadModel.js";

// CREATE LEAD
export const createLead = async (req, res) => {
    try {
        const { name, email, phone, company, source, status } = req.body;

        if (!name?.trim() || !email?.trim() || !phone?.trim() || !source) {
            return res.status(400).json({
                success: false,
                message: "Name, email, phone and source are required",
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email.trim())) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email",
            });
        }

        const validSources = ["Website", "Referral", "Social Media", "Other"];
        const validStatuses = ["New", "Contacted", "Qualified", "Lost"];

        if (!validSources.includes(source)) {
            return res.status(400).json({
                success: false,
                message: "Invalid lead source",
            });
        }

        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid lead status",
            });
        }

        const lead = await Lead.create({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            phone: phone.trim(),
            company: company?.trim() || "",
            source,
            status: status || "New",
            userId: req.user._id,
        });

        return res.status(201).json({
            success: true,
            message: "Lead created successfully",
            lead,
        });
    } catch (error) {
        console.error("Create Lead Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


// READ ALL LEADS + SEARCH + STATUS FILTER
export const getLeads = async (req, res) => {
    try {
        const { search, status } = req.query;

        const filter = {
            userId: req.user._id,
        };

        if (status) {
            filter.status = status;
        }

        if (search?.trim()) {
            filter.$or = [
                { name: { $regex: search.trim(), $options: "i" } },
                { email: { $regex: search.trim(), $options: "i" } },
                { company: { $regex: search.trim(), $options: "i" } },
            ];
        }

        const leads = await Lead.find(filter).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: leads.length,
            leads,
        });
    } catch (error) {
        console.error("Get Leads Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


// READ SINGLE LEAD
export const getLeadById = async (req, res) => {
    try {
        const lead = await Lead.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!lead) {
            return res.status(404).json({
                success: false,
                message: "Lead not found",
            });
        }

        return res.status(200).json({
            success: true,
            lead,
        });
    } catch (error) {
        console.error("Get Lead Error:", error);

        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid lead ID",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


// UPDATE LEAD
export const updateLead = async (req, res) => {
    try {
        const { name, email, phone, company, source, status } = req.body;

        const updates = {};
        const fields = { name, email, phone, company, source, status };

        for (const [key, value] of Object.entries(fields)) {
            if (value !== undefined) {
                updates[key] = typeof value === "string" ? value.trim() : value;
            }
        }

        if (updates.name !== undefined && !updates.name) {
            return res.status(400).json({
                success: false,
                message: "Name cannot be empty",
            });
        }

        if (updates.email !== undefined) {
            if (!updates.email) {
                return res.status(400).json({
                    success: false,
                    message: "Email cannot be empty",
                });
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(updates.email)) {
                return res.status(400).json({
                    success: false,
                    message: "Please enter a valid email",
                });
            }

            updates.email = updates.email.toLowerCase();
        }

        if (updates.phone !== undefined && !updates.phone) {
            return res.status(400).json({
                success: false,
                message: "Phone cannot be empty",
            });
        }

        if (updates.source !== undefined &&
            !["Website", "Referral", "Social Media", "Other"].includes(updates.source)) {
            return res.status(400).json({
                success: false,
                message: "Invalid lead source",
            });
        }

        if (updates.status !== undefined &&
            !["New", "Contacted", "Qualified", "Lost"].includes(updates.status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid lead status",
            });
        }

        const lead = await Lead.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.user._id,
            },
            { $set: updates },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!lead) {
            return res.status(404).json({
                success: false,
                message: "Lead not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Lead updated successfully",
            lead,
        });
    } catch (error) {
        console.error("Update Lead Error:", error);

        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid lead ID",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


// DELETE LEAD
export const deleteLead = async (req, res) => {
    try {
        const lead = await Lead.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!lead) {
            return res.status(404).json({
                success: false,
                message: "Lead not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Lead deleted successfully",
        });
    } catch (error) {
        console.error("Delete Lead Error:", error);

        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid lead ID",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
