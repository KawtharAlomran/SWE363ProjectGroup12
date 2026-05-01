import express from "express";
import cors from "cors";


import dotenv  from "dotenv";
import { connectDB } from "./db.js";
import { Faculty } from "./models/Faculty.js";
import { Course } from "./models/Course.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5174;

app.use(cors());              
app.use(express.json());

await connectDB(process.env.MONGO_URL);

app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));