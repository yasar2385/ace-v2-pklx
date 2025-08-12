import { configureStore } from "@reduxjs/toolkit";
import aceSlicers from "./slicers";
export const store = configureStore({
    devTools: true,
    reducer: {
        slicers : aceSlicers
    }
})