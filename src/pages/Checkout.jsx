import React, { useState } from 'react';
import { formatRupee } from '../utils/formatCurrency';
import { useSelector, useDispatch } from 'react-redux';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Box,
    IconButton,
    Button,
    Grid,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { removeFromCart, updateQuantity, clearCart } from '../features/cart/cartSlice';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
    const { items } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [openDialog, setOpenDialog] = useState(false);

    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    const handlePlaceOrder = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        setOpenDialog(true);
    };

    const confirmOrder = () => {
        dispatch(clearCart());
        setOpenDialog(false);
        navigate('/home');
        alert('Order Placed Successfully!');
    };

    if (items.length === 0) {
        return (
            <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h5" gutterBottom>
                    Your cart is empty
                </Typography>
                <Button variant="contained" onClick={() => navigate('/home')}>
                    Continue Shopping
                </Button>
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Checkout
            </Typography>

            <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                    <TableContainer component={Paper}>
                        <Table aria-label="cart table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Product</TableCell>
                                    <TableCell align="center">Price</TableCell>
                                    <TableCell align="center">Quantity</TableCell>
                                    <TableCell align="center">Total</TableCell>
                                    <TableCell align="center">Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {items.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell component="th" scope="row">
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <img src={item.thumbnail} alt={item.title} width={50} height={50} style={{ objectFit: 'cover', borderRadius: 4 }} />
                                                <Typography variant="body2">{item.title}</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="center">{formatRupee(item.price)}</TableCell>
                                        <TableCell align="center">
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <IconButton
                                                    size="small"
                                                    disabled={item.quantity <= 1}
                                                    onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                                                >
                                                    <RemoveIcon fontSize="small" />
                                                </IconButton>
                                                <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
                                                <IconButton
                                                    size="small"
                                                    disabled={typeof item.stock === 'number' ? item.quantity >= item.stock : false}
                                                    onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                                                >
                                                    <AddIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="center">
                                            {formatRupee(item.price * item.quantity)}
                                        </TableCell>
                                        <TableCell align="center">
                                            <IconButton color="error" onClick={() => dispatch(removeFromCart(item.id))}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Order Summary
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography>Total Items:</Typography>
                            <Typography>{totalItems}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="h6">Total Amount:</Typography>
                            <Typography variant="h6" color="primary">
                                {formatRupee(totalAmount)}
                            </Typography>
                        </Box>
                        <Button
                            variant="contained"
                            fullWidth
                            size="large"
                            onClick={handlePlaceOrder}
                        >
                            Place Order
                        </Button>
                    </Paper>
                </Grid>
            </Grid>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Confirm Order</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to place this order for {formatRupee(totalAmount)}?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={confirmOrder} variant="contained" autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Checkout;
