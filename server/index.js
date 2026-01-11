import express from "express";
import mongoose from "mongoose"
import cors from 'cors'
import dotenv from "dotenv"

import authRoutes from "./routes/auth.routes.js";
import movieRoutes from "./routes/movie.routes.js";

dotenv.config();

const app = express();
app.use(cors(
    {
        origin: [`${process.env.CLIENT_URL}`],
        methods: ["POST", "GET", "PUT", "DELETE"],
        credentials: true,
    }
))
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/movies", movieRoutes);

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`)
);