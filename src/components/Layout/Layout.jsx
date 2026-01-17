import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AppBar, Toolbar, Typography, Button, Badge, IconButton, Container, Box } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LogoutIcon from '@mui/icons-material/Logout';
import { logout } from '../../features/auth/authSlice';

const Layout = () => {
    const { user } = useSelector((state) => state.auth);
    // Calculate total items (sum of quantities)
    const cartItems = useSelector((state) => state.cart.items);
    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <>
            <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: '1px solid #e0e0e0', backdropFilter: 'blur(8px)', backgroundColor: 'rgba(255,255,255,0.8)' }}>
                <Container maxWidth="lg">
                    <Toolbar disableGutters>
                        <Typography
                            variant="h6"
                            component={Link}
                            to="/home"
                            sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }}
                        >
                            ShopMaster
                        </Typography>

                        <Button color="inherit" component={Link} to="/home">
                            Home
                        </Button>

                        {user ? (
                            <>
                                <IconButton component={Link} to="/checkout" color="inherit">
                                    <Badge badgeContent={cartCount} color="secondary">
                                        <ShoppingCartIcon />
                                    </Badge>
                                </IconButton>
                                <Box sx={{ ml: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
                                        {user.firstName}
                                    </Typography>
                                    <IconButton onClick={handleLogout} color="inherit" title="Logout">
                                        <LogoutIcon />
                                    </IconButton>
                                </Box>
                            </>
                        ) : (
                            <Button color="inherit" component={Link} to="/login">
                                Login
                            </Button>
                        )}
                    </Toolbar>
                </Container>
            </AppBar>

            <Container maxWidth="lg" sx={{ py: 4, minHeight: '80vh' }}>
                <Outlet />
            </Container>

            <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', backgroundColor: '#e0e0e0' }}>
                <Container maxWidth="lg">
                    <Typography variant="body2" color="text.secondary" align="center">
                        © {new Date().getFullYear()} ShopMaster E-Commerce. All rights reserved.
                    </Typography>
                </Container>
            </Box>
        </>
    );
};

export default Layout;
