// src/features/workflowSlice.js
import { createSlice } from '@reduxjs/toolkit';

const workflowSlice = createSlice({
  name: 'workflow',
  initialState: {
    workflows: [],
    selectedWorkflow: '',
    workflowId: null,
    error: null,
  },
  reducers: {
    setWorkflows(state, action) {
      state.workflows = action.payload;
    },
    setSelectedWorkflow(state, action) {
      state.selectedWorkflow = action.payload;
    },
    setWorkflowId(state, action) {
      state.workflowId = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { setWorkflows, setSelectedWorkflow, setWorkflowId, setError } = workflowSlice.actions;
export default workflowSlice.reducer;
