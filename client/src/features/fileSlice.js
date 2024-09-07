import { createSlice } from '@reduxjs/toolkit';

const fileSlice = createSlice({
  name: 'file',
  initialState: {
    csvFileMetadata: null, // Store only metadata
    selectedWorkflow: '',
  },
  reducers: {
    setCsvFileMetadata: (state, action) => {
      state.csvFileMetadata = action.payload;
    },
    setSelectedWorkflow: (state, action) => {
      state.selectedWorkflow = action.payload;
    },
  },
});

export const { setCsvFileMetadata, setSelectedWorkflow } = fileSlice.actions;
export default fileSlice.reducer;
