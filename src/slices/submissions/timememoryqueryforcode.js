import { createSlice } from "@reduxjs/toolkit";



const TimeMemoryCodeQuerySlice = createSlice({
    name : "timmemquery",
    initialState : {
        data : {
            range : null,
            query : null
        },
        isLoading : false
    },
    reducers : {
        setData : (state,action) => {
            state.data = action.payload;
        },
        setLoading : (state,action) => {
            state.isLoading = action.payload
        }
    }
})

export const {setData,setLoading} = TimeMemoryCodeQuerySlice.actions;
export default TimeMemoryCodeQuerySlice.reducer; 