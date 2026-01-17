import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Grid,
    Box,
    CircularProgress,
    Typography,
    Button,
    Pagination,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Paper
} from '@mui/material';
import { fetchProducts, fetchCategories, setCategory, setPage } from '../features/products/productSlice';
import ProductCard from '../components/UI/ProductCard';

const Home = () => {
    const dispatch = useDispatch();
    const {
        products,
        categories,
        status,
        total,
        filters: { category },
        pagination: { limit, currentPage }
    } = useSelector((state) => state.products);

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchProducts({
            limit,
            skip: (currentPage - 1) * limit,
            category
        }));
    }, [dispatch, currentPage, category, limit]);

    const handleCategoryChange = (event) => {
        dispatch(setCategory(event.target.value));
    };

    const normalizedCategories = categories
        .map((cat) => {
            if (typeof cat === 'string') {
                return { slug: cat, name: cat };
            }
            if (cat && typeof cat === 'object') {
                return {
                    slug: cat.slug || cat.name || cat.category || String(cat),
                    name: cat.name || cat.slug || cat.category || String(cat),
                };
            }
            return null;
        })
        .filter(Boolean);

    const handlePageChange = (event, value) => {
        dispatch(setPage(value));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (status === 'failed') {
        return <Typography color="error">Error loading products. Please try again.</Typography>;
    }

    return (
        <Box>
            {/* Hero Section */}
            <Paper
                sx={{
                    position: 'relative',
                    backgroundColor: 'grey.800',
                    color: '#fff',
                    mb: 4,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    backgroundImage: 'url(/hero-banner.png)',
                    minHeight: '400px',
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: 2,
                    overflow: 'hidden'
                }}
            >
                {<img style={{ display: 'none' }} src="/hero-banner.png" alt="Hero Background" />}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        right: 0,
                        left: 0,
                        backgroundColor: 'rgba(0,0,0,.4)',
                    }}
                />
                <Grid container>
                    <Grid item md={6}>
                        <Box
                            sx={{
                                position: 'relative',
                                p: { xs: 3, md: 6 },
                                pr: { md: 0 },
                            }}
                        >
                            <Typography component="h1" variant="h3" color="inherit" gutterBottom sx={{ fontWeight: 'bold' }}>
                                Upgrade Your Lifestyle
                            </Typography>
                            <Typography variant="h5" color="inherit" paragraph>
                                Discover premium products tailored for your modern home and style. Shop the latest gadgets, fashion, and more.
                            </Typography>
                            <Button variant="contained" size="large" sx={{ mt: 2, px: 4, py: 1.5, borderRadius: 50, fontWeight: 'bold' }}>
                                Shop Now
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            {/* Filters Section */}
            <Paper sx={{ p: 2, mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5" component="h2">
                    {category === 'all' ? 'All Products' : category.charAt(0).toUpperCase() + category.slice(1)}
                </Typography>

                <FormControl size="small" sx={{ minWidth: 200 }}>
                    <InputLabel id="category-select-label">Category</InputLabel>
                    <Select
                        labelId="category-select-label"
                        id="category-select"
                        value={category}
                        label="Category"
                        onChange={handleCategoryChange}
                    >
                        <MenuItem value="all">All Categories</MenuItem>
                        {normalizedCategories.map((cat) => (
                            <MenuItem key={cat.slug} value={cat.slug}>
                                {cat.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Paper>

            {/* Products Grid */}
            {status === 'loading' ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <Grid container spacing={2}>
                        {products.map((product) => (
                            <Grid item key={product.id} xs={12}>
                                <ProductCard product={product} />
                            </Grid>
                        ))}
                    </Grid>

                    {/* Pagination */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                        <Pagination
                            count={Math.ceil(total / limit)}
                            page={currentPage}
                            onChange={handlePageChange}
                            color="primary"
                            size="large"
                        />
                    </Box>
                </>
            )}
        </Box>
    );
};

export default Home;
