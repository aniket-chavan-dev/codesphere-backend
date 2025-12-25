import { createSlice } from "@reduxjs/toolkit"

const codeSlice = createSlice({
    name : "code",
    initialState : {
        code : {
            lang : "python",
            val : ""
        },
        user : null
    },

    reducers : {
        setCodeGlobally : (state,action) => {
            state.code = action.payload.obj;
            state.user = action.payload.user;
        },
        resetCode : (state,action) => {
            state.code = {
                lang : "python",
                val : ""
            };
        },
        setCodeValGlobally : (state,action) => {
            state.code.val = action.payload
        }
    }

})

export const { setCodeGlobally,resetCode,setCodeValGlobally } = codeSlice.actions;

export default codeSlice.reducer;

