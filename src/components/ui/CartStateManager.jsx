import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_CART':
      return action.payload;
    
    case 'ADD_ITEM':
      const existingItemIndex = state.items.findIndex(
        item => item.id === action.payload.id
      );
      
      let updatedItems;
      if (existingItemIndex >= 0) {
        updatedItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        updatedItems = [...state.items, action.payload];
      }
      
      const newTotal = updatedItems.reduce(
        (total, item) => total + (item.price * item.quantity), 0
      );
      
      return {
        ...state,
        items: updatedItems,
        total: newTotal,
        itemCount: updatedItems.reduce((count, item) => count + item.quantity, 0)
      };
    
    case 'REMOVE_ITEM':
      const filteredItems = state.items.filter(item => item.id !== action.payload);
      const filteredTotal = filteredItems.reduce(
        (total, item) => total + (item.price * item.quantity), 0
      );
      
      return {
        ...state,
        items: filteredItems,
        total: filteredTotal,
        itemCount: filteredItems.reduce((count, item) => count + item.quantity, 0)
      };
    
    case 'UPDATE_QUANTITY':
      const quantityUpdatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.max(0, action.payload.quantity) }
          : item
      ).filter(item => item.quantity > 0);
      
      const quantityUpdatedTotal = quantityUpdatedItems.reduce(
        (total, item) => total + (item.price * item.quantity), 0
      );
      
      return {
        ...state,
        items: quantityUpdatedItems,
        total: quantityUpdatedTotal,
        itemCount: quantityUpdatedItems.reduce((count, item) => count + item.quantity, 0)
      };
    
    case 'CLEAR_CART':
      return {
        items: [],
        total: 0,
        itemCount: 0,
        lastUpdated: new Date().toISOString()
      };
    
    case 'SET_PAYMENT_STATUS':
      return {
        ...state,
        paymentStatus: action.payload.status,
        orderId: action.payload.orderId,
        paymentMethod: action.payload.method
      };
    
    default:
      return state;
  }
};

const initialCartState = {
  items: [],
  total: 0,
  itemCount: 0,
  paymentStatus: null,
  orderId: null,
  paymentMethod: null,
  lastUpdated: new Date().toISOString()
};

export const CartStateManager = ({ children }) => {
  const [cartState, dispatch] = useReducer(cartReducer, initialCartState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('chickKartCart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: parsedCart });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('chickKartCart', JSON.stringify(cartState));
  }, [cartState]);

  const addToCart = (item) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: item.quantity || 1,
        customizations: item.customizations || []
      }
    });
  };

  const removeFromCart = (itemId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: itemId });
  };

  const updateQuantity = (itemId, quantity) => {
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { id: itemId, quantity }
    });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const setPaymentStatus = (status, orderId = null, method = null) => {
    dispatch({
      type: 'SET_PAYMENT_STATUS',
      payload: { status, orderId, method }
    });
  };

  const getCartSummary = () => ({
    itemCount: cartState.itemCount,
    total: cartState.total,
    isEmpty: cartState.items.length === 0,
    items: cartState.items
  });

  const contextValue = {
    cartState,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    setPaymentStatus,
    getCartSummary
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartStateManager');
  }
  return context;
};

export default CartStateManager;