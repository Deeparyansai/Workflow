import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: false,
    user: null,
    token: null,
  },
  reducers: {
    setLoggedIn: (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    // Other reducers
  },
});

export const { setLoggedIn } = authSlice.actions;
export default authSlice.reducer;
