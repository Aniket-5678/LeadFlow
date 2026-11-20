import express from "express";
import cors from "cors";
import dotenv from "dotenv"
import connectDB from "./db/db.js"
import authRoutes from "./routes/authRoutes.js"
import leadRoutes from "./routes/leadRoutes.js";
// dotenv config
dotenv.config();

// mongodb config
connectDB()

const app = express();

app.use(express.json());

app.use(cors())

// Authentication Routes
app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);

app.get("/", (req, res) => {
  res.send("hello world");
});


app.listen(process.env.PORT, () => {
  console.log(`server is running on ${process.env.PORT}`);
});