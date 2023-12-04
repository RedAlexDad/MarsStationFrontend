// Employee.ts
import {createSlice} from "@reduxjs/toolkit";

const initialState = [{
    id: -1,
    type_status: "",
    date_create: "",
    date_form: "",
    date_close: "",
    status_task: 1,
    status_mission: NaN,
    geographical_object: [],
    employee: "",
    moderator: "",
    transport: []
}];

const MarsStation = createSlice({
    name: "mars_station",
    initialState: initialState,
    reducers: {
        // @ts-ignore
        updateMarsStation: (state, action) => {
            return action.payload;
        },
        // @ts-ignore
        cleanMarsStation: (state) => {
            return initialState;
        },
    },
});

export const {updateMarsStation, cleanMarsStation} = MarsStation.actions;

export default MarsStation.reducer;