import { createSlice} from "@reduxjs/toolkit"

const testCasesSlice = createSlice({
    name : "test cases",
    initialState : {
        problem : null,
        testcases : null,
        test_cases : null
    },
    reducers : {
        setTestCasesGlobally : (state,action) => {
            state.testcases = action.payload;
        },
        setProblemGlobally : (state,action) => {
            state.problem = action.payload;
        },
        setTest_CasesGlobally : (state,action) => {
            state.test_cases = action.payload;
        }
    }
})


export const { setTestCasesGlobally, setProblemGlobally,setTest_CasesGlobally} = testCasesSlice.actions;

export default testCasesSlice.reducer;