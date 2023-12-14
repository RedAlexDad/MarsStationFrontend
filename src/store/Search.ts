// Employee.ts
import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    feature: "",
    status_task: [] as string[],
};

const feature_geographical_object = createSlice({
    name: "search",
    initialState: initialState,
    reducers: {
        updateFeatureGeographicalObject: (state, action) => {
            state.feature = action.payload;
        },
        cleanFeatureGeographicalObject: (state) => {
            state.feature = initialState.feature;
        },
        updateStatusTask: (state, action) => {
            state.status_task = action.payload;
        },
        cleanStatusTask: (state) => {
            state.status_task = initialState.status_task;
        },
    },
});

export const {
    updateFeatureGeographicalObject,
    cleanFeatureGeographicalObject,
    updateStatusTask,
    cleanStatusTask
} = feature_geographical_object.actions;

export default feature_geographical_object.reducer;