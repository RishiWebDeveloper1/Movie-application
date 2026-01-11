import React, { useEffect, useState } from 'react';
import { Visibility, VisibilityOff, Email, Lock, Movie, Star } from '@mui/icons-material';
import { Box, Container, TextField, Button, Typography, Paper, InputAdornment, IconButton, Link, Divider, Alert, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [loginError, setLoginError] = useState('');
    const { token, login } = useAuth()
    console.log('login')

    const navigate = useNavigate()

    const fetchUserDetail = async () => {
        if (token) {
            console.log(token)
            navigate('/redirect')
        }
    }

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password) => {
        return password.length >= 6;
    };

    const validateForm = () => {
        const newErrors = {};

        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (!validatePassword(password)) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError('');

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/login`, { email, password })
            login(response.data)
            navigate('/redirect')
        } catch (error) {
            setLoginError('Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        if (errors.email) {
            setErrors({ ...errors, email: '' });
        }
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        if (errors.password) {
            setErrors({ ...errors, password: '' });
        }
    };

    useEffect(() => {
        fetchUserDetail()
    }, [token])

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'radial-gradient(circle at 20% 50%, rgba(255, 215, 0, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 107, 107, 0.1) 0%, transparent 50%)',
                    pointerEvents: 'none'
                }
            }}
        >
            <Container maxWidth="sm">
                <Paper
                    elevation={24}
                    sx={{
                        padding: { xs: 3, sm: 5 },
                        borderRadius: 4,
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)',
                        position: 'relative',
                        zIndex: 1
                    }}
                >
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Box
                            sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 80,
                                height: 80,
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                mb: 2,
                                boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)'
                            }}
                        >
                            <Movie sx={{ fontSize: 40, color: 'white' }} />
                        </Box>
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 700,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                mb: 1
                            }}
                        >
                            MovieRate
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5, mb: 1 }}>
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} sx={{ color: '#FFD700', fontSize: 20 }} />
                            ))}
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                            Rate, Review & Discover Movies
                        </Typography>
                    </Box>

                    {loginError && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {loginError}
                        </Alert>
                    )}

                    <form onSubmit={handleLogin}>
                        <Box sx={{ mb: 3 }}>
                            <TextField
                                fullWidth
                                label="Email"
                                type="email"
                                value={email}
                                onChange={handleEmailChange}
                                error={!!errors.email}
                                helperText={errors.email}
                                disabled={isLoading}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Email sx={{ color: '#667eea' }} />
                                        </InputAdornment>
                                    )
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '&:hover fieldset': {
                                            borderColor: '#667eea'
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#667eea'
                                        }
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: '#667eea'
                                    }
                                }}
                            />
                        </Box>

                        <Box sx={{ mb: 2 }}>
                            <TextField
                                fullWidth
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={handlePasswordChange}
                                error={!!errors.password}
                                helperText={errors.password}
                                disabled={isLoading}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Lock sx={{ color: '#667eea' }} />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                                disabled={isLoading}
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '&:hover fieldset': {
                                            borderColor: '#667eea'
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#667eea'
                                        }
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: '#667eea'
                                    }
                                }}
                            />
                        </Box>

                        <Box sx={{ textAlign: 'right', mb: 3 }}>
                            <Link
                                href="#"
                                underline="hover"
                                sx={{
                                    color: '#667eea',
                                    fontSize: '0.875rem',
                                    fontWeight: 500,
                                    '&:hover': {
                                        color: '#764ba2'
                                    }
                                }}
                            >
                                Forgot Password?
                            </Link>
                        </Box>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            disabled={isLoading}
                            sx={{
                                py: 1.5,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                boxShadow: '0 4px 16px rgba(102, 126, 234, 0.4)',
                                textTransform: 'none',
                                fontSize: '1rem',
                                fontWeight: 600,
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #5568d3 0%, #6a3d94 100%)',
                                    boxShadow: '0 6px 20px rgba(102, 126, 234, 0.5)'
                                },
                                '&:disabled': {
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    opacity: 0.7
                                }
                            }}
                        >
                            {isLoading ? (
                                <CircularProgress size={24} sx={{ color: 'white' }} />
                            ) : (
                                'Sign In'
                            )}
                        </Button>
                    </form>

                    <Divider sx={{ my: 3 }}>
                        <Typography variant="body2" color="text.secondary">
                            OR
                        </Typography>
                    </Divider>

                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                            Don't have an account?{' '}
                            <Link
                                href="#"
                                underline="hover"
                                sx={{
                                    color: '#667eea',
                                    fontWeight: 600,
                                    '&:hover': {
                                        color: '#764ba2'
                                    }
                                }}
                            >
                                Sign Up
                            </Link>
                        </Typography>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default Login;