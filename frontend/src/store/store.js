import { configureStore } from '@reduxjs/toolkit'
import usersReducer from './usersSlice'
import productsReducer from './productsSlice'
import adminProductsReducer from './adminProductsSlice'


export const store = configureStore({
  reducer: {
    users: usersReducer,
    products: productsReducer,
    adminProducts: adminProductsReducer,
  },
})
