import { createSlice } from "@reduxjs/toolkit";


const DisplaySuccessMessageSlice = createSlice({
    name : "success message",
    initialState : {
        message : null,
        notifyTodisplayMessage : true
    },
    reducers : {
        setMessage : (state,action) => {
            state.message = action.payload;
            state.notifyTodisplayMessage = true
        },
        resetSuccessMesager : (state,action) => {
            state.message = null,
            state.notifyTodisplayMessage = false
        }
    }
})

export const {setMessage,resetSuccessMesager} = DisplaySuccessMessageSlice.actions;
export default DisplaySuccessMessageSlice.reducer;