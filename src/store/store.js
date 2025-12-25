import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../slices/userslice";
import testcasesReducer from "../slices/testcasesSlice";
import codeReducer from "../slices/usercodeSlice";
import editorSettingReducer from "../slices/editorSettingSlice";
import runPublicTestCasesResultReducer from "../slices/runPublicTestCasesResultSlice";
import submissionReducer from "../slices/submissions/submissionSlice"
import TimeMemoryQuerySlice from "../slices/submissions/timememoryqueryforcode"
import DisplaySuccessMessageSlice from "../slices/successMessageDisplaySlice"

export const store = configureStore({
  reducer: {
    user: userReducer,
    testcases: testcasesReducer,
    code: codeReducer,
    editorSetting: editorSettingReducer,
    pubTestResult: runPublicTestCasesResultReducer,
    submissions : submissionReducer,
    timeMemQuery : TimeMemoryQuerySlice,
    successMesager : DisplaySuccessMessageSlice,
  },
});
