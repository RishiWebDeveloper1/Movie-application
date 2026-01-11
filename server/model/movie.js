import mongoose from "mongoose";

const MovieSchema = new mongoose.Schema({
  rank: Number,
  title: String,
  description: String,
  rating: Number,
  votes: String,
  releaseDate: Date,
  duration: Number,
  poster: String
});

const MovieModel = mongoose.model("movieList", MovieSchema);

export default MovieModel;