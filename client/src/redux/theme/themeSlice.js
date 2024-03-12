// themeSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: 'light',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      console.log('Toggle Theme Action - New Theme:', newTheme);
      return {
        ...state,
        theme: newTheme,
      };
    },
  },
});

export const { toggleTheme } = themeSlice.actions;

export default themeSlice.reducer;
