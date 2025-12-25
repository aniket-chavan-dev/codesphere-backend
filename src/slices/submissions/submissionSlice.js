import { createSlice } from "@reduxjs/toolkit";

const SubmissionsSlice = createSlice({
  name: "submissions",
  initialState: {
    result: null,
    loading: false,
    isSubmitBtnClicked : false,
  },
  reducers: {
    setSubResult: (state, action) => {
      state.result = action.payload;
    },
    setSubLoading: (state, action) => {
      state.loading = action.payload;
    },
    setSubBtnCliked : (state,action) => {
      state.isSubmitBtnClicked = action.payload;
    },
    resetSubmission : (state,action) => {
      state.isSubmitBtnClicked = false;
      state.loading = false;
      state.result = null;
    },
    
  },
});

export const { setSubLoading, setSubResult,setSubBtnCliked,resetSubmission,  } = SubmissionsSlice.actions;
export default SubmissionsSlice.reducer;
