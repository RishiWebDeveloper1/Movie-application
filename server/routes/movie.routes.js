import express from "express";
import { getMovies, deleteMovie, updateMovie, addMovie } from "../controllers/movie.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { adminOnly } from "../middlewares/admin.middleware.js";

const router = express.Router();

router.get("/", getMovies);

// ADMIN ONLY
router.post("/", protect, adminOnly, addMovie);
router.put("/:id", protect, adminOnly, updateMovie);
router.delete("/:id", protect, adminOnly, deleteMovie);

export default router;
