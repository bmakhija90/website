import React, { createContext, useContext, useReducer, useState } from 'react';
import config from '../config';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }]
      };

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };

    case 'CLEAR_CART':
      return {
        ...state,
        items: []
      };

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  const [notification, setNotification] = useState({
    open: false,
    product: null
  });

  const showNotification = (product) => {
    setNotification({
      open: true,
      product: {
        ...product,
        quantity: 1 // Default quantity when first added
      }
    });
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

 const addToCart = (product) => {
  const cartProduct = {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.basePrice || product.price,
    image: product.imagePaths && product.imagePaths.length > 0 
      ? `${config.IMAGE_BASE_URL}${product.imagePaths[0]}`
      : product.image || 'https://via.placeholder.com/300x200?text=No+Image',
    category: product.category,
    stock: product.stock,
    sizes: product.sizes || [],
    color: product.color || 'Black', // Add default color
    size: product.size || 'M', // Add default size
    width: product.width || 'Standard' // Add default width
  };
  
  dispatch({ type: 'ADD_TO_CART', payload: cartProduct });
  showNotification(cartProduct);
};


  const removeFromCart = (productId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });
    }
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getCartTotal = () => {
    return state.items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartItemsCount = () => {
    return state.items.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cart: state,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartItemsCount,
      notification,
      hideNotification
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};