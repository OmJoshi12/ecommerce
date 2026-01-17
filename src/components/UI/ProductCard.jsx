import React from 'react';
import { formatRupee } from '../../utils/formatCurrency';
import { useDispatch } from 'react-redux';
import { Card, CardMedia, CardContent, Typography, CardActions, Button, Rating, Box, Chip } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { addToCart } from '../../features/cart/cartSlice';
import { useSnackbar } from 'notistack';

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const handleAddToCart = () => {
        dispatch(addToCart(product));
        enqueueSnackbar(`${product.title} added to cart!`, { variant: 'success', autoHideDuration: 2000 });
    };

    return (
        <Card sx={{
            height: '100%',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            transition: 'transform 0.2s',
            '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 4
            }
        }}>
            <Box sx={{ position: 'relative', width: { xs: '100%', sm: 260 }, flexShrink: 0 }}>
                <CardMedia
                    component="img"
                    height={200}
                    image={product.thumbnail}
                    alt={product.title}
                    sx={{ objectFit: 'cover', width: '100%', height: { xs: 220, sm: '100%' } }}
                />
                {product.discountPercentage > 0 && (
                    <Chip
                        label={`-${Math.round(product.discountPercentage)}%`}
                        color="secondary"
                        size="small"
                        sx={{ position: 'absolute', top: 8, right: 8 }}
                    />
                )}
            </Box>

            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography gutterBottom variant="h6" component="div" noWrap title={product.title}>
                    {product.title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating value={product.rating} precision={0.1} readOnly size="small" />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                        ({product.rating})
                    </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    height: '40px',
                    mb: 2
                }}>
                    {product.description}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', mt: 'auto' }}>
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                        {formatRupee(product.price)}
                    </Typography>
                    {typeof product.stock === 'number' && (
                        <Typography variant="caption" color="text.secondary">
                            Stock: {product.stock}
                        </Typography>
                    )}
                </Box>
            </CardContent>
            <CardActions sx={{ px: 2, pb: 2, width: { xs: '100%', sm: 220 }, alignSelf: { xs: 'stretch', sm: 'center' } }}>
                <Button
                    variant="contained"
                    fullWidth
                    startIcon={<AddShoppingCartIcon />}
                    onClick={handleAddToCart}
                >
                    Add to Cart
                </Button>
            </CardActions>
        </Card>
    );
};

export default ProductCard;
