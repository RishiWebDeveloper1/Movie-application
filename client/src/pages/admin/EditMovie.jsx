import React, { useEffect, useState } from "react";
import { Box, Typography, TextField, Pagination, Stack, Paper, InputAdornment, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, Tooltip, Alert, Snackbar, } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import StarIcon from "@mui/icons-material/Star";
import PeopleIcon from "@mui/icons-material/People";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { HomeRepairServiceOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const EditMovie = () => {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [formData, setFormData] = useState({
    rank: "",
    title: "",
    description: "",
    rating: "",
    votes: "",
    releaseDate: "",
    duration: "",
    poster: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const { token } = useAuth();
  const navigate = useNavigate()

  const LIMIT = 20;

  useEffect(() => {
    fetchMovies();
  }, [page, search]);

  const fetchMovies = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/movies`, {
        params: {
          page: page,
          limit: LIMIT,
          sortBy: '',
          search: search,
        }
      });
      setMovies(res.data.movies);
      setTotal(res.data.total);
    } catch (error) {
      showSnackbar("Failed to fetch movies", "error");
    }
  };

  // Open add dialog
  const handleAddClick = () => {
    setFormData({
      rank: "",
      title: "",
      description: "",
      rating: "",
      votes: "",
      releaseDate: "",
      duration: "",
      poster: "",
    });
    setAddDialogOpen(true);
  };

  // Open edit dialog
  const handleEditClick = (movie) => {
    setSelectedMovie(movie);
    setFormData({
      rank: movie.rank,
      title: movie.title,
      description: movie.description || "",
      rating: movie.rating,
      votes: movie.votes,
      releaseDate: movie.releaseDate ? movie.releaseDate.split("T")[0] : "",
      duration: movie.duration,
      poster: movie.poster || "",
    });
    setEditDialogOpen(true);
  };

  // Open delete dialog
  const handleDeleteClick = (movie) => {
    setSelectedMovie(movie);
    setDeleteDialogOpen(true);
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Add new movie
  const handleAddMovie = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/movies`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      showSnackbar("Movie added successfully", "success");
      setAddDialogOpen(false);
      fetchMovies();
    } catch (error) {
      showSnackbar("Failed to add movie", "error");
    }
  };

  // Save edited movie
  const handleSaveEdit = async () => {
    try {
      await axios.put(`${import.meta.env.VITE_BASE_URL}/movies/${selectedMovie._id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      showSnackbar("Movie updated successfully", "success");
      setEditDialogOpen(false);
      fetchMovies();
    } catch (error) {
      showSnackbar("Failed to update movie", "error");
    }
  };

  // Delete movie
  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/movies/${selectedMovie._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      showSnackbar("Movie deleted successfully", "success");
      setDeleteDialogOpen(false);
      fetchMovies();
    } catch (error) {
      showSnackbar("Failed to delete movie", "error");
    }
  };

  // Show snackbar notification
  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Generate placeholder poster URL
  const getPosterUrl = (movie) => {
    return (
      movie.poster ||
      `https://via.placeholder.com/200x300/1a1a1a/d4af37?text=${encodeURIComponent(
        movie.title.substring(0, 20)
      )}`
    );
  };

  return (
    <Box sx={{ backgroundColor: "#0f0f0f", minHeight: "100vh", py: 5, px: 3 }}>
      {/* Header */}
      <Box sx={{ textAlign: "center", mb: 5 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 600,
            color: "#ffffff",
            mb: 1,
            letterSpacing: "2px",
          }}
        >
          MANAGE MOVIES
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "#d4af37",
              letterSpacing: "2px",
              textTransform: "uppercase",
            }}
          >
            Edit & Delete Movie Records
          </Typography>
        </Box>
      </Box>
      
        <Button
          variant="contained"
          startIcon={<HomeRepairServiceOutlined />}
          onClick={() => navigate("/")}
          sx={{
            background: "linear-gradient(135deg, #d4af37 0%, #f4e5a1 100%)",
            color: "#0f0f0f",
            fontWeight: 600,
            px: 3,
            "&:hover": {
              background: "linear-gradient(135deg, #c49d2f 0%, #e5d690 100%)",
            },
          }}
        >
          Home
        </Button> 

      {/* Content Container */}
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        {/* Search and Add Button */}
        <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
          <TextField
            fullWidth
            placeholder="Search movies by title..."
            variant="outlined"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#d4af37" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#1a1a1a",
                borderRadius: 2,
                "& fieldset": {
                  borderColor: "#2a2a2a",
                },
                "&:hover fieldset": {
                  borderColor: "#d4af37",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#d4af37",
                },
                "& input": {
                  color: "#ffffff",
                  fontSize: "0.95rem",
                },
                "& input::placeholder": {
                  color: "#666",
                  opacity: 1,
                },
              },
            }}
          />

          {/* Add Movie Button */}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddClick}
            sx={{
              background: "linear-gradient(135deg, #d4af37 0%, #f4e5a1 100%)",
              color: "#0f0f0f",
              fontWeight: 600,
              px: 3,
              whiteSpace: "nowrap",
              "&:hover": {
                background: "linear-gradient(135deg, #c49d2f 0%, #e5d690 100%)",
              },
            }}
          >
            Add Movie
          </Button>
        </Stack>

        {/* Movie List */}
        <Stack spacing={2.5}>
          {movies.map((movie) => (
            <Paper
              key={movie._id}
              elevation={0}
              sx={{
                background: "linear-gradient(135deg, #1a1a1a 0%, #252525 100%)",
                border: "1px solid #2a2a2a",
                borderRadius: 2,
                p: 2.5,
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: "#d4af37",
                  boxShadow: "0 4px 16px rgba(212, 175, 55, 0.1)",
                },
              }}
            >
              <Stack direction="row" spacing={2.5} alignItems="flex-start">
                {/* Movie Poster */}
                <Box sx={{ position: "relative", flexShrink: 0 }}>
                  <Box
                    component="img"
                    src={getPosterUrl(movie)}
                    alt={movie.title}
                    sx={{
                      width: 100,
                      height: 150,
                      objectFit: "cover",
                      borderRadius: 1.5,
                      border: "2px solid #2a2a2a",
                    }}
                  />
                  {/* Rank Badge */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: -8,
                      left: -8,
                      width: 36,
                      height: 36,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background:
                        "linear-gradient(135deg, #d4af37 0%, #f4e5a1 100%)",
                      borderRadius: "8px",
                      border: "2px solid #0f0f0f",
                      boxShadow: "0 4px 12px rgba(212, 175, 55, 0.4)",
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: "0.9rem",
                        color: "#0f0f0f",
                      }}
                    >
                      #{movie.rank}
                    </Typography>
                  </Box>
                </Box>

                {/* Movie Details */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: "#ffffff",
                      lineHeight: 1.3,
                      mb: 1,
                      fontSize: "1.25rem",
                    }}
                  >
                    {movie.title}
                  </Typography>

                  {movie.description && (
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#9e9e9e",
                        mb: 1.5,
                        lineHeight: 1.5,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {movie.description}
                    </Typography>
                  )}

                  <Stack direction="row" spacing={1.5} flexWrap="wrap" sx={{ gap: 1 }}>
                    <Chip
                      icon={
                        <StarIcon
                          sx={{ fontSize: 16, color: "#d4af37 !important" }}
                        />
                      }
                      label={movie.rating}
                      size="small"
                      sx={{
                        backgroundColor: "rgba(212, 175, 55, 0.15)",
                        border: "1px solid rgba(212, 175, 55, 0.4)",
                        color: "#d4af37",
                        fontWeight: 700,
                        fontSize: "0.875rem",
                      }}
                    />

                    <Chip
                      icon={
                        <PeopleIcon
                          sx={{ fontSize: 16, color: "#9e9e9e !important" }}
                        />
                      }
                      label={movie.votes.toLocaleString()}
                      size="small"
                      sx={{
                        backgroundColor: "rgba(158, 158, 158, 0.08)",
                        border: "1px solid rgba(158, 158, 158, 0.2)",
                        color: "#9e9e9e",
                        fontSize: "0.875rem",
                      }}
                    />

                    <Chip
                      icon={
                        <AccessTimeIcon
                          sx={{ fontSize: 16, color: "#9e9e9e !important" }}
                        />
                      }
                      label={`${movie.duration} min`}
                      size="small"
                      sx={{
                        backgroundColor: "rgba(158, 158, 158, 0.08)",
                        border: "1px solid rgba(158, 158, 158, 0.2)",
                        color: "#9e9e9e",
                        fontSize: "0.875rem",
                      }}
                    />
                  </Stack>
                </Box>

                {/* Action Buttons */}
                <Stack direction="row" spacing={1}>
                  <Tooltip title="Edit Movie">
                    <IconButton
                      onClick={() => handleEditClick(movie)}
                      sx={{
                        backgroundColor: "rgba(212, 175, 55, 0.1)",
                        border: "1px solid rgba(212, 175, 55, 0.3)",
                        color: "#d4af37",
                        "&:hover": {
                          backgroundColor: "rgba(212, 175, 55, 0.2)",
                          borderColor: "#d4af37",
                        },
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Delete Movie">
                    <IconButton
                      onClick={() => handleDeleteClick(movie)}
                      sx={{
                        backgroundColor: "rgba(231, 76, 60, 0.1)",
                        border: "1px solid rgba(231, 76, 60, 0.3)",
                        color: "#e74c3c",
                        "&:hover": {
                          backgroundColor: "rgba(231, 76, 60, 0.2)",
                          borderColor: "#e74c3c",
                        },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Stack>
            </Paper>
          ))}
        </Stack>

        {/* Pagination */}
        <Stack alignItems="center" mt={5} mb={3}>
          <Pagination
            count={Math.ceil(total / LIMIT)}
            page={page}
            onChange={(e, value) => setPage(value)}
            size="large"
            sx={{
              "& .MuiPaginationItem-root": {
                color: "#b8b8b8",
                borderColor: "#2a2a2a",
                fontSize: "1rem",
                fontWeight: 600,
                "&:hover": {
                  backgroundColor: "rgba(212, 175, 55, 0.1)",
                  borderColor: "#d4af37",
                },
                "&.Mui-selected": {
                  backgroundColor: "#d4af37",
                  color: "#0f0f0f",
                  fontWeight: 700,
                  "&:hover": {
                    backgroundColor: "#c49d2f",
                  },
                },
              },
            }}
          />
        </Stack>
      </Box>

      {/* Add Movie Dialog */}
      <Dialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: "#1a1a1a",
            border: "1px solid #2a2a2a",
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle
          sx={{
            color: "#ffffff",
            borderBottom: "1px solid #2a2a2a",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Add New Movie
          </Typography>
          <IconButton
            onClick={() => setAddDialogOpen(false)}
            sx={{ color: "#9e9e9e" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ mt: 2 }}>
          <Grid container spacing={2.5}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Rank"
                name="rank"
                type="number"
                value={formData.rank}
                onChange={handleInputChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#0f0f0f",
                    "& fieldset": { borderColor: "#2a2a2a" },
                    "&:hover fieldset": { borderColor: "#d4af37" },
                    "&.Mui-focused fieldset": { borderColor: "#d4af37" },
                    "& input": { color: "#ffffff" },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#9e9e9e",
                    "&.Mui-focused": { color: "#d4af37" },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Rating"
                name="rating"
                type="number"
                inputProps={{ step: "0.1", min: "0", max: "10" }}
                value={formData.rating}
                onChange={handleInputChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#0f0f0f",
                    "& fieldset": { borderColor: "#2a2a2a" },
                    "&:hover fieldset": { borderColor: "#d4af37" },
                    "&.Mui-focused fieldset": { borderColor: "#d4af37" },
                    "& input": { color: "#ffffff" },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#9e9e9e",
                    "&.Mui-focused": { color: "#d4af37" },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#0f0f0f",
                    "& fieldset": { borderColor: "#2a2a2a" },
                    "&:hover fieldset": { borderColor: "#d4af37" },
                    "&.Mui-focused fieldset": { borderColor: "#d4af37" },
                    "& input": { color: "#ffffff" },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#9e9e9e",
                    "&.Mui-focused": { color: "#d4af37" },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                multiline
                rows={3}
                value={formData.description}
                onChange={handleInputChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#0f0f0f",
                    "& fieldset": { borderColor: "#2a2a2a" },
                    "&:hover fieldset": { borderColor: "#d4af37" },
                    "&.Mui-focused fieldset": { borderColor: "#d4af37" },
                    "& textarea": { color: "#ffffff" },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#9e9e9e",
                    "&.Mui-focused": { color: "#d4af37" },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Votes"
                name="votes"
                value={formData.votes}
                onChange={handleInputChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#0f0f0f",
                    "& fieldset": { borderColor: "#2a2a2a" },
                    "&:hover fieldset": { borderColor: "#d4af37" },
                    "&.Mui-focused fieldset": { borderColor: "#d4af37" },
                    "& input": { color: "#ffffff" },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#9e9e9e",
                    "&.Mui-focused": { color: "#d4af37" },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Duration (minutes)"
                name="duration"
                type="number"
                value={formData.duration}
                onChange={handleInputChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#0f0f0f",
                    "& fieldset": { borderColor: "#2a2a2a" },
                    "&:hover fieldset": { borderColor: "#d4af37" },
                    "&.Mui-focused fieldset": { borderColor: "#d4af37" },
                    "& input": { color: "#ffffff" },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#9e9e9e",
                    "&.Mui-focused": { color: "#d4af37" },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Release Date"
                name="releaseDate"
                type="date"
                value={formData.releaseDate}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#0f0f0f",
                    "& fieldset": { borderColor: "#2a2a2a" },
                    "&:hover fieldset": { borderColor: "#d4af37" },
                    "&.Mui-focused fieldset": { borderColor: "#d4af37" },
                    "& input": { color: "#ffffff" },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#9e9e9e",
                    "&.Mui-focused": { color: "#d4af37" },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Poster URL"
                name="poster"
                value={formData.poster}
                onChange={handleInputChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#0f0f0f",
                    "& fieldset": { borderColor: "#2a2a2a" },
                    "&:hover fieldset": { borderColor: "#d4af37" },
                    "&.Mui-focused fieldset": { borderColor: "#d4af37" },
                    "& input": { color: "#ffffff" },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#9e9e9e",
                    "&.Mui-focused": { color: "#d4af37" },
                  },
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5, borderTop: "1px solid #2a2a2a" }}>
          <Button
            onClick={() => setAddDialogOpen(false)}
            sx={{
              color: "#9e9e9e",
              "&:hover": { backgroundColor: "rgba(158, 158, 158, 0.1)" },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddMovie}
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              background: "linear-gradient(135deg, #d4af37 0%, #f4e5a1 100%)",
              color: "#0f0f0f",
              fontWeight: 600,
              "&:hover": {
                background: "linear-gradient(135deg, #c49d2f 0%, #e5d690 100%)",
              },
            }}
          >
            Add Movie
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: "#1a1a1a",
            border: "1px solid #2a2a2a",
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle
          sx={{
            color: "#ffffff",
            borderBottom: "1px solid #2a2a2a",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Edit Movie Details
          </Typography>
          <IconButton
            onClick={() => setEditDialogOpen(false)}
            sx={{ color: "#9e9e9e" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ mt: 2 }}>
          <Grid container spacing={2.5} sx={{ padding: '10px' }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Rank"
                name="rank"
                type="number"
                value={formData.rank}
                onChange={handleInputChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#0f0f0f",
                    "& fieldset": { borderColor: "#2a2a2a" },
                    "&:hover fieldset": { borderColor: "#d4af37" },
                    "&.Mui-focused fieldset": { borderColor: "#d4af37" },
                    "& input": { color: "#ffffff" },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#9e9e9e",
                    "&.Mui-focused": { color: "#d4af37" },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Rating"
                name="rating"
                type="number"
                inputProps={{ step: "0.1", min: "0", max: "10" }}
                value={formData.rating}
                onChange={handleInputChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#0f0f0f",
                    "& fieldset": { borderColor: "#2a2a2a" },
                    "&:hover fieldset": { borderColor: "#d4af37" },
                    "&.Mui-focused fieldset": { borderColor: "#d4af37" },
                    "& input": { color: "#ffffff" },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#9e9e9e",
                    "&.Mui-focused": { color: "#d4af37" },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#0f0f0f",
                    "& fieldset": { borderColor: "#2a2a2a" },
                    "&:hover fieldset": { borderColor: "#d4af37" },
                    "&.Mui-focused fieldset": { borderColor: "#d4af37" },
                    "& input": { color: "#ffffff" },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#9e9e9e",
                    "&.Mui-focused": { color: "#d4af37" },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                multiline
                rows={3}
                value={formData.description}
                onChange={handleInputChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#0f0f0f",
                    "& fieldset": { borderColor: "#2a2a2a" },
                    "&:hover fieldset": { borderColor: "#d4af37" },
                    "&.Mui-focused fieldset": { borderColor: "#d4af37" },
                    "& textarea": { color: "#ffffff" },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#9e9e9e",
                    "&.Mui-focused": { color: "#d4af37" },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Votes"
                name="votes"
                value={formData.votes}
                onChange={handleInputChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#0f0f0f",
                    "& fieldset": { borderColor: "#2a2a2a" },
                    "&:hover fieldset": { borderColor: "#d4af37" },
                    "&.Mui-focused fieldset": { borderColor: "#d4af37" },
                    "& input": { color: "#ffffff" },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#9e9e9e",
                    "&.Mui-focused": { color: "#d4af37" },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Duration (minutes)"
                name="duration"
                type="number"
                value={formData.duration}
                onChange={handleInputChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#0f0f0f",
                    "& fieldset": { borderColor: "#2a2a2a" },
                    "&:hover fieldset": { borderColor: "#d4af37" },
                    "&.Mui-focused fieldset": { borderColor: "#d4af37" },
                    "& input": { color: "#ffffff" },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#9e9e9e",
                    "&.Mui-focused": { color: "#d4af37" },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Release Date"
                name="releaseDate"
                type="date"
                value={formData.releaseDate}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#0f0f0f",
                    "& fieldset": { borderColor: "#2a2a2a" },
                    "&:hover fieldset": { borderColor: "#d4af37" },
                    "&.Mui-focused fieldset": { borderColor: "#d4af37" },
                    "& input": { color: "#ffffff" },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#9e9e9e",
                    "&.Mui-focused": { color: "#d4af37" },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Poster URL"
                name="poster"
                value={formData.poster}
                onChange={handleInputChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#0f0f0f",
                    "& fieldset": { borderColor: "#2a2a2a" },
                    "&:hover fieldset": { borderColor: "#d4af37" },
                    "&.Mui-focused fieldset": { borderColor: "#d4af37" },
                    "& input": { color: "#ffffff" },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#9e9e9e",
                    "&.Mui-focused": { color: "#d4af37" },
                  },
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5, borderTop: "1px solid #2a2a2a" }}>
          <Button
            onClick={() => setEditDialogOpen(false)}
            sx={{
              color: "#9e9e9e",
              "&:hover": { backgroundColor: "rgba(158, 158, 158, 0.1)" },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveEdit}
            variant="contained"
            startIcon={<SaveIcon />}
            sx={{
              background: "linear-gradient(135deg, #d4af37 0%, #f4e5a1 100%)",
              color: "#0f0f0f",
              fontWeight: 600,
              "&:hover": {
                background: "linear-gradient(135deg, #c49d2f 0%, #e5d690 100%)",
              },
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: "#1a1a1a",
            border: "1px solid #2a2a2a",
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle sx={{ color: "#ffffff" }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Delete Movie
          </Typography>
        </DialogTitle>

        <DialogContent>
          <Typography sx={{ color: "#9e9e9e" }}>
            Are you sure you want to delete{" "}
            <strong style={{ color: "#d4af37" }}>
              {selectedMovie?.title}
            </strong>
            ? This action cannot be undone.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{
              color: "#9e9e9e",
              "&:hover": { backgroundColor: "rgba(158, 158, 158, 0.1)" },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            startIcon={<DeleteIcon />}
            sx={{
              background: "linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)",
              color: "#ffffff",
              fontWeight: 600,
              "&:hover": {
                background: "linear-gradient(135deg, #c0392b 0%, #a93226 100%)",
              },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{
            backgroundColor: "#1a1a1a",
            border: `1px solid ${snackbar.severity === "success" ? "#d4af37" : "#e74c3c"}`,
            color: "#ffffff",
            "& .MuiAlert-icon": { color: snackbar.severity === "success" ? "#d4af37" : "#e74c3c", },
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EditMovie;