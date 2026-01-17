export const formatRupee = (value) => {
    if (typeof value !== 'number') return value;
    const convertedValue = value * 83; // Approx conversion rate
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(convertedValue);
};
