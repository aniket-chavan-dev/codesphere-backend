import { createSlice } from "@reduxjs/toolkit";


const editorSettingsSlice = createSlice({
    name : "editor settings",
    initialState : {
       editorSetting : {
        fontsize : 14,
        wordWrap : false,
        tabSize : 4,
        lineNumber : false
       }
    },
    reducers : {
        setEditorSettingGlobally : (state,action) => {
            state.editorSetting = action.payload;
        }
    }
})

export const {setEditorSettingGlobally} = editorSettingsSlice.actions;

export default editorSettingsSlice.reducer;