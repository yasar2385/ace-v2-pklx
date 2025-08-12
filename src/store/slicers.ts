import { createSlice } from "@reduxjs/toolkit";

const initialState : any = {};

const slicers = createSlice({
    name: "aceSlicers",
    initialState,
    reducers: {
        setSchedule: (state, action) => {
            state.scheduleId = action.payload;
        },
        setCourt: (state, action) => {
            state.courtId = action.payload;
        },
        setGroup: (state, action) => {
            state.groupId = action.payload;
        },
        setGroupDetails: (state, action) => {
            state.groupDetails = action.payload;
        }
    }
});


export const { setSchedule, setCourt, setGroup, setGroupDetails } = slicers.actions;
export default slicers.reducer;
