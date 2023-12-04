// Employee.ts
import {createSlice} from "@reduxjs/toolkit";
import defaultImage from "../assets/mock.png";

const initialState = [{
    id: -1,
    feature: "",
    type: "",
    size: -1,
    describe: "",
    photo: defaultImage,
    status: true
}];

const GeographicalObject = createSlice({
    name: "geographical_object",
    initialState: initialState,
    reducers: {
        // @ts-ignore
        updateGeographicalObject: (state, action) => {
            return action.payload;
        },
        // @ts-ignore
        cleanGeographicalObject: (state) => {
            return initialState;
        },
    },
});

export const {updateGeographicalObject, cleanGeographicalObject} = GeographicalObject.actions;

export default GeographicalObject.reducer;