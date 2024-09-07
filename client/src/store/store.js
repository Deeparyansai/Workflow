// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import workflowReducer from '../features/workflowSlice';
import fileReducer from '../features/fileSlice';
import authReducer from '../features/authSlice';

export const store = configureStore({
  reducer: {
    workflow: workflowReducer,
    file: fileReducer,
    auth: authReducer,
  },
});
