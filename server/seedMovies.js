import mongoose from "mongoose";
import Movie from "./model/movie.js";

/* ========== CONFIG (ONLY CHANGE THESE) ========== */
const MONGO_URI = "mongodb+srv://rishivishwa4877:rishiMongodb@cluster0.k16x7.mongodb.net/movie?retryWrites=true&w=majority&appName=Cluster0";

// start replacing from this rank
const START_RANK = 41;

/* 20 movies only */
const movieBaseList4 = [
  { title: "The Shining", poster: "https://image.tmdb.org/t/p/w500/9fgh3Ns1iRzlQNYuJyK0ARQZU7w.jpg" },
  { title: "Blade Runner", poster: "https://image.tmdb.org/t/p/w500/63N9uy8nd9j7Eog2axPQ8lbr3Wj.jpg" },
  { title: "A Clockwork Orange", poster: "https://image.tmdb.org/t/p/w500/4sHeTAp65WrSSuc05nRBKddhBxO.jpg" },
  { title: "Taxi Driver", poster: "https://image.tmdb.org/t/p/w500/ekstpH614fwDX8DUln1a2Opz0N8.jpg" },
  { title: "Lawrence of Arabia", poster: "https://image.tmdb.org/t/p/w500/8k2hZ7rT0kzC5pY6U3n0JVpaz6Z.jpg" },
  { title: "The Seventh Seal", poster: "https://image.tmdb.org/t/p/w500/wcZ21zrOsy0b52AfAF50XpTiv75.jpg" },
  { title: "Vertigo", poster: "https://image.tmdb.org/t/p/w500/15uOEfqBNTVtDUT7hGBVCka0rZz.jpg" },
  { title: "2001: A Space Odyssey", poster: "https://image.tmdb.org/t/p/w500/ve72VxNPGGz5yD7ZJ4nN0E0eCcz.jpg" },
  { title: "Sunset Boulevard", poster: "https://image.tmdb.org/t/p/w500/zt8aQ6kswqKp1cG6N0zB5bM2fK6.jpg" },
  { title: "Dr. Strangelove", poster: "https://image.tmdb.org/t/p/w500/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg" },

  { title: "Singin’ in the Rain", poster: "https://image.tmdb.org/t/p/w500/w03EiJVHP8Un77boQeE7hg9DVdU.jpg" },
  { title: "The Treasure of the Sierra Madre", poster: "https://image.tmdb.org/t/p/w500/3u1Z6k3gYxD7T5uXr5mC6Zz6E2J.jpg" },
  { title: "The Elephant Man", poster: "https://image.tmdb.org/t/p/w500/zKQFtgfZzHnF9nL91z3NofM8Jrj.jpg" },
  { title: "Chinatown", poster: "https://image.tmdb.org/t/p/w500/1nG8xWyZ2b3JpZ9M1m7Kp6Pp6wB.jpg" },
  { title: "No Country for Old Men", poster: "https://image.tmdb.org/t/p/w500/6d5XOczc226jECq0LIX0siKtgHR.jpg" },
  { title: "There Will Be Blood", poster: "https://image.tmdb.org/t/p/w500/fa0RDkAlCec0STeM0G3G8qUqkzF.jpg" },
  { title: "Fargo", poster: "https://image.tmdb.org/t/p/w500/9tH2s9mA2z4z8f5y5z6Rk5v0wGm.jpg" },
  { title: "The Big Lebowski", poster: "https://image.tmdb.org/t/p/w500/5BwqwxMEjeFtdknRV792Svo0K1v.jpg" },
  { title: "Heat", poster: "https://image.tmdb.org/t/p/w500/rr7E0NoGKxvbkb89eR1GwfoYjpA.jpg" },
  { title: "Casino", poster: "https://image.tmdb.org/t/p/w500/4TS5O1IP42bY2BvgMx4Wl4nYk1G.jpg" }
];



/* ========== LOGIC (DO NOT TOUCH) ========== */

const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");

    for (let i = 0; i < movieBaseList.length; i++) {
      const rank = START_RANK + i;
      const movie = movieBaseList[i];

      await Movie.updateOne(
        { rank }, // 🔑 match by rank
        {
          $set: {
            rank,
            title: movie.title,
            poster: movie.poster,
            description: `Top ranked movie: ${movie.title}`,
            rating: Number((8 + Math.random()).toFixed(1)),
            votes: `${(Math.random() * 3 + 0.5).toFixed(1)}M`,
            duration: 90 + Math.floor(Math.random() * 90),
            releaseDate: new Date(
              1980 + Math.floor(Math.random() * 40),
              Math.floor(Math.random() * 12),
              Math.floor(Math.random() * 28)
            ),
          },
        },
        { upsert: true } // ✅ replace if exists, insert if not
      );
    }

    console.log(
      `Replaced movies from rank ${START_RANK} to ${
        START_RANK + movieBaseList.length - 1
      }`
    );

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();
