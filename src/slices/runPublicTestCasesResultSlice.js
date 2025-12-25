import { createSlice } from "@reduxjs/toolkit";


const runPublicTestCasesResultSlice = createSlice({
    name : "publice test cases result",
    initialState : {
        result : null,
        loading : false,
        runbtnCliked : false,
    },
    reducers : {
        setPublicTestCasesResult : (state,action) => {
            state.result = action.payload;
        },
        setLoading : (state,action) => {
            state.loading= action.payload;
        },
        setRunBtn : (state,action) => {
            state.runbtnCliked = action.payload;
        },
        setReset : (state,action) => {
            state.loading = false;
            state.runbtnCliked = false;
            state.result = null;
        }
    }
})

export const {setPublicTestCasesResult,setLoading,setRunBtn,setReset} = runPublicTestCasesResultSlice.actions;

export default runPublicTestCasesResultSlice.reducer;