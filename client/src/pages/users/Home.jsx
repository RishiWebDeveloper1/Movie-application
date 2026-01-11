import React, { useEffect, useState } from "react";
import { Box, Typography, TextField, Pagination, Stack, Paper, InputAdornment, Chip, AppBar, Toolbar, IconButton, Avatar, Menu, MenuItem, ListItemIcon, ListItemText, Divider, } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import StarIcon from "@mui/icons-material/Star";
import PeopleIcon from "@mui/icons-material/People";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MovieIcon from "@mui/icons-material/Movie";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const { logout, user } = useAuth()

  const navigate = useNavigate()

  const LIMIT = 20;

  useEffect(() => {
    fetchMovies();
  }, [page, search]);

  const fetchMovies = async () => {
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
  };

  // User menu handlers
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    navigate('/admin/edit')
    handleMenuClose();
  };

  const handleMyMovies = () => {
    console.log("Navigate to my movies");
    handleMenuClose();
  };

  const handleSettings = () => {
    console.log("Navigate to settings");
    handleMenuClose();
  };

  const handleLogout = () => {
    logout()
    navigate('/login')
    handleMenuClose();
    // Add your logout logic here
  };

  // Generate placeholder poster URL
  const getPosterUrl = (movie) => {
    // If you have poster URLs in your data, use: movie.poster
    // For now, using placeholder with movie title
    return `https://via.placeholder.com/200x300/1a1a1a/d4af37?text=${encodeURIComponent(movie.title.substring(0, 20))}`;
  };

  return (
    <Box sx={{ backgroundColor: "#0f0f0f", minHeight: "100vh" }}>
      {/* Top Navbar */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: "linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%)",
          borderBottom: "1px solid #2a2a2a",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
          {/* Left - App Name */}
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <MovieIcon sx={{ color: "#d4af37", fontSize: 32 }} />
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                background: "linear-gradient(135deg, #d4af37 0%, #f4e5a1 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: "1px",
                fontFamily: "'Playfair Display', serif",
              }}
            >
              MOVIEBASE
            </Typography>
          </Stack>

          {/* Right - User Profile */}
          <Box>
            <IconButton
              onClick={handleMenuOpen}
              sx={{
                border: "2px solid #d4af37",
                padding: 0.5,
                "&:hover": {
                  backgroundColor: "rgba(212, 175, 55, 0.1)",
                },
              }}
            >
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  background: "linear-gradient(135deg, #d4af37 0%, #f4e5a1 100%)",
                  fontWeight: 700,
                }}
              >
                U
              </Avatar>
            </IconButton>

            {/* User Menu */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  minWidth: 220,
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #2a2a2a",
                  borderRadius: 2,
                  "& .MuiMenuItem-root": {
                    color: "#ffffff",
                    py: 1.5,
                    "&:hover": {
                      backgroundColor: "rgba(212, 175, 55, 0.1)",
                      "& .MuiListItemIcon-root": {
                        color: "#d4af37",
                      },
                    },
                  },
                },
              }}
            >
              {
                user.role == 'admin' &&
                <MenuItem onClick={handleProfile}>
                  <ListItemIcon>
                    <AccountCircleIcon sx={{ color: "#9e9e9e" }} />
                  </ListItemIcon>
                  <ListItemText>Admin Page</ListItemText>
                </MenuItem>
              }

              <MenuItem onClick={handleMyMovies}>
                <ListItemIcon>
                  <FavoriteIcon sx={{ color: "#9e9e9e" }} />
                </ListItemIcon>
                <ListItemText>My Movies</ListItemText>
              </MenuItem>

              <MenuItem onClick={handleSettings}>
                <ListItemIcon>
                  <SettingsIcon sx={{ color: "#9e9e9e" }} />
                </ListItemIcon>
                <ListItemText>Settings</ListItemText>
              </MenuItem>

              <Divider sx={{ my: 1, borderColor: "#2a2a2a" }} />

              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon sx={{ color: "#e74c3c" }} />
                </ListItemIcon>
                <ListItemText sx={{ color: "#e74c3c" }}>Logout</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ py: 5, px: 3 }}>
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
            TOP RATED MOVIES
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1 }}>
            <Divider sx={{ width: 60, borderColor: "#d4af37", borderWidth: 1.5 }} />
            <StarIcon sx={{ color: "#d4af37", fontSize: 18 }} />
            <Divider sx={{ width: 60, borderColor: "#d4af37", borderWidth: 1.5 }} />
          </Box>
        </Box>

        {/* Content Container */}
        <Box sx={{ maxWidth: 1200, mx: "auto" }}>
          {/* Search */}
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
              mb: 4,
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

          {/* Movie List */}
          <Stack spacing={2.5}>
            {movies.map((movie, index) => (
              <Paper
                key={movie._id}
                elevation={0}
                sx={{
                  background: "linear-gradient(135deg, #1a1a1a 0%, #252525 100%)",
                  border: "1px solid #2a2a2a",
                  borderRadius: 2,
                  p: 2.5,
                  transition: "all 0.3s ease",
                  position: "relative",
                  overflow: "hidden",
                  "&:hover": {
                    borderColor: "#d4af37",
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 24px rgba(212, 175, 55, 0.15)",
                  },
                }}
              >
                <Stack direction="row" spacing={2.5} alignItems="flex-start">
                  {/* Movie Poster */}
                  <Box
                    sx={{
                      position: "relative",
                      flexShrink: 0,
                    }}
                  >
                    <Box
                      component="img"
                      // src={getPosterUrl(movie)}
                      src={movie.poster}
                      alt={movie.title}
                      sx={{
                        width: 100,
                        height: 150,
                        objectFit: "cover",
                        borderRadius: 1.5,
                        border: "2px solid #2a2a2a",
                      }}
                    />
                    {/* Rank Badge on Poster */}
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
                        background: "linear-gradient(135deg, #d4af37 0%, #f4e5a1 100%)",
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
                          fontFamily: "'Bebas Neue', sans-serif",
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
                        mb: 1.5,
                        fontSize: "1.25rem",
                        fontFamily: "'Roboto Slab', serif",
                      }}
                    >
                      {movie.title}
                    </Typography>

                    <Stack
                      direction="row"
                      spacing={1.5}
                      flexWrap="wrap"
                      sx={{ gap: 1 }}
                    >
                      {/* Rating */}
                      <Chip
                        icon={<StarIcon sx={{ fontSize: 16, color: "#d4af37 !important" }} />}
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

                      {/* Votes */}
                      <Chip
                        icon={<PeopleIcon sx={{ fontSize: 16, color: "#9e9e9e !important" }} />}
                        label={movie.votes.toLocaleString()}
                        size="small"
                        sx={{
                          backgroundColor: "rgba(158, 158, 158, 0.08)",
                          border: "1px solid rgba(158, 158, 158, 0.2)",
                          color: "#9e9e9e",
                          fontSize: "0.875rem",
                        }}
                      />

                      {/* Duration */}
                      <Chip
                        icon={<AccessTimeIcon sx={{ fontSize: 16, color: "#9e9e9e !important" }} />}
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
      </Box>
    </Box>
  );
};

export default Home;