import Movie from "../model/movie.js";

export const getMovies = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;

        const { search, sortBy } = req.query;
        /* ---------------- FILTER ---------------- */
        const filter = {};

        // Search by title OR description
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
            ];
        }
        /* ---------------- SORT ---------------- */
        let sort = { rank: 1 }; // default

        if (sortBy === "rating") {
            sort = { rating: 1 };
        }
        if (sortBy === "duration") {
            sort = { duration: 1 };
        }
        /* ---------------- QUERY ---------------- */
        const movies = await Movie.find(filter)
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await Movie.countDocuments(filter);

        res.status(200).json({
            success: true,
            total,
            page,
            limit,
            movies,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch movies",
        });
    }
};


export const addMovie = async (req, res) => {
    try {
        const movieData = req.body;

        // Optional: auto-rank if not provided
        if (!movieData.rank) {
            const lastMovie = await Movie.findOne().sort({ rank: -1 });
            movieData.rank = lastMovie ? lastMovie.rank + 1 : 1;
        }

        const newMovie = await Movie.create(movieData);

        res.status(201).json({
            success: true,
            message: "Movie added successfully",
            movie: newMovie,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to add movie",
        });
    }
};

export const deleteMovie = async (req, res) => {
    try {
        const { id } = req.params;

        const movie = await Movie.findById(id);
        if (!movie) {
            return res.status(404).json({ message: "Movie not found" });
        }

        await Movie.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Movie deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete movie",
        });
    }
};

export const updateMovie = async (req, res) => {
    try {
        const { id } = req.params;

        const updatedMovie = await Movie.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!updatedMovie) {
            return res.status(404).json({ message: "Movie not found" });
        }

        res.status(200).json({
            success: true,
            message: "Movie updated successfully",
            movie: updatedMovie,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update movie",
        });
    }
};
