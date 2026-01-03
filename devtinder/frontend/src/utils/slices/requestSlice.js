import { createSlice } from "@reduxjs/toolkit";

const requestSlice = createSlice({
  name: "request",
  initialState: [],
  reducers: {
    setRequest: (state, action) => {
      return action.payload;
    },
    removeRequest: (state, action) => {
      const requestId = action.payload;
      return state.filter((req) => req._id !== requestId);
    },
  },
});

export const { setRequest, removeRequest } = requestSlice.actions;
export default requestSlice.reducer;
