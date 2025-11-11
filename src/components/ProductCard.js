import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Rating,
  Chip,
  Tooltip,
} from '@mui/material';
import { useCart } from '../context/CartContext';
import config from '../config';
import { textUtils } from '../utils/textUtils';

const ProductCard = ({ product, maxDescriptionLines = 3 }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    const cartProduct = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.basePrice,
      image: product.imagePaths && product.imagePaths.length > 0 
        ? `${config.IMAGE_BASE_URL}${product.imagePaths[0]}`
        : 'https://via.placeholder.com/300x200?text=No+Image',
      category: product.category,
      stock: product.stock,
      sizes: product.sizes || []
    };
    addToCart(cartProduct);
  };

  const productRating = product.rating || 4.0;
  const reviewCount = product.reviewCount || Math.floor(Math.random() * 100) + 1;
  const imageUrl = product.imagePaths && product.imagePaths.length > 0 
    ? `${config.IMAGE_BASE_URL}${product.imagePaths[0]}`
    : 'https://via.placeholder.com/300x200?text=No+Image';

  const descriptionNeedsTooltip = textUtils.needsTruncation(product.description, 150);

  return (
    <Card sx={{ maxWidth: 345, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="200"
        image={imageUrl}
        alt={product.name}
        sx={{ objectFit: 'cover' }}
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
        }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        {/* Product Name with 2-line truncation */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography 
            gutterBottom 
            variant="h6" 
            component="h2" 
            sx={{ 
              mb: 0, 
              flex: 1, 
              mr: 1,
              ...textUtils.getLineClampStyle(2),
              lineHeight: 1.3,
              minHeight: textUtils.getMinHeight(2, 1.3)
            }}
          >
            {product.name}
          </Typography>
          <Chip 
            label={product.category} 
            size="small" 
            color="primary" 
            variant="outlined" 
          />
        </Box>
        
        {/* Product Description with tooltip and truncation */}
        <Tooltip 
          title={descriptionNeedsTooltip ? product.description : ''} 
          arrow 
          placement="top"
        >
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mb: 2,
              ...textUtils.getLineClampStyle(maxDescriptionLines),
              lineHeight: 1.5,
              minHeight: textUtils.getMinHeight(maxDescriptionLines, 1.5),
              cursor: descriptionNeedsTooltip ? 'help' : 'default'
            }}
          >
            {product.description}
          </Typography>
        </Tooltip>

        {/* Sizes */}
        {product.sizes && product.sizes.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.4 }}>
              Sizes: {product.sizes.join(', ')}
            </Typography>
          </Box>
        )}

        {/* Rating */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Rating value={productRating} readOnly precision={0.5} size="small" />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1, fontSize: '0.875rem' }}>
            ({reviewCount})
          </Typography>
        </Box>

        {/* Price and Add to Cart */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h6" color="primary" sx={{ lineHeight: 1.2 }}>
              ${product.basePrice}
            </Typography>
            <Typography 
              variant="caption" 
              color={product.stock > 0 ? 'success.main' : 'error.main'}
              sx={{ lineHeight: 1.2 }}
            >
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={handleAddToCart}
            disabled={!product.isActive || product.stock === 0}
            sx={{ flexShrink: 0 }}
          >
            {!product.isActive ? 'Inactive' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;