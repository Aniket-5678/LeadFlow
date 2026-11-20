
import express from "express";

import {
    signup,
    signin,
    getMe,
} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";


const router = express.Router();

// Signup API
router.post("/signup", signup);

// Signin API
router.post("/signin", signin);


// Protected route
router.get("/me", authMiddleware, getMe);
export default router;
