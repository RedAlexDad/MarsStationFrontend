import {createSlice} from "@reduxjs/toolkit";
import defaultImage from "../assets/mock.png";

interface GeographicalObjectState {
    data: {
        id: number;
        feature: string;
        type: string;
        size: number;
        describe: string;
        photo: string;
        status: boolean;
    }[];
    pagination: {
        currentPage: number;
        totalPages: number;
        count: number;
    };
}

const initialState: GeographicalObjectState = {
    data: [{
        id: -1,
        feature: "",
        type: "",
        size: -1,
        describe: "",
        photo: defaultImage,
        status: true,
    },],
    pagination: {
        currentPage: 1,
        totalPages: 1,
        count: 0,
    },
};

const GeographicalObject = createSlice({
    name: "geographical_object",
    initialState: initialState,
    reducers: {
        updateGeographicalObject: (state, action) => {
            state.data = action.payload;
        },
        updatePagination: (state, action) => {
            state.pagination = action.payload;
        },
        // @ts-ignore
        cleanGeographicalObject: (state) => {
            return initialState;
        },
    },
});

export const {
    updateGeographicalObject,
    updatePagination,
    cleanGeographicalObject,
} = GeographicalObject.actions;

export default GeographicalObject.reducer;
