import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Typography,
    Alert,
    CircularProgress,
    InputAdornment,
    Divider
} from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { loginUser, clearError } from '../features/auth/authSlice';

const Login = () => {
    const [username, setUsername] = useState('emilys');
    const [password, setPassword] = useState('emilyspass');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { status, error, user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (user) {
            navigate('/home');
        }
        return () => {
            dispatch(clearError());
        }
    }, [user, navigate, dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser({ username, password }));
    };

    const fillDemo = () => {
        setUsername('emilys');
        setPassword('emilyspass');
    };

    return (
        <Box
            sx={{
                minHeight: 'calc(100vh - 64px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                px: 2,
                py: 6,
                background: 'radial-gradient(1200px circle at 20% 20%, rgba(63,81,181,0.15), transparent 60%), radial-gradient(900px circle at 80% 40%, rgba(245,0,87,0.12), transparent 55%), #f4f6f8',
            }}
        >
            <Card sx={{ maxWidth: 460, width: '100%', p: 1, boxShadow: 6, borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                    <Typography variant="h4" component="h1" align="center" sx={{ fontWeight: 700, mb: 1 }}>
                        Sign in
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
                        Login to continue to ShopMaster
                    </Typography>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{String(error)}</Alert>}

                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Username"
                            fullWidth
                            margin="normal"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonOutlineIcon fontSize="small" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            label="Password"
                            type="password"
                            fullWidth
                            margin="normal"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockOutlinedIcon fontSize="small" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            sx={{ mt: 2, py: 1.2, borderRadius: 2, fontWeight: 700 }}
                            disabled={status === 'loading'}
                        >
                            {status === 'loading' ? <CircularProgress size={24} /> : 'Login'}
                        </Button>
                    </form>

                    <Divider sx={{ my: 2.5 }} />

                    <Typography variant="body2" color="text.secondary" align="center">
                        Demo credentials: <b>emilys</b> / <b>emilyspass</b>
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1.5 }}>
                        <Button variant="text" size="small" onClick={fillDemo} disabled={status === 'loading'}>
                            Use demo credentials
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default Login;
