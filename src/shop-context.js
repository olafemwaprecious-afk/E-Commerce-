import { createContext, useContext } from 'react';

// Shared marketplace context. Kept in its own module so account components can
// read cart, saved products and quick-view actions without importing main.jsx.
export const C = createContext(null);
export const useShop = () => useContext(C);
