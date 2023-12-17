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
    id_draft: number;
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
    id_draft: -1,
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
        cleanGeographicalObject: () => {
            return initialState;
        },
        updateID_draft: (state, action) => {
            state.id_draft = action.payload === null ? -1 : action.payload;
        },
        clearID_draft: (state) => {
            state.id_draft = initialState.id_draft;
        },
    },
});

export const {
    updateGeographicalObject,
    updatePagination,
    cleanGeographicalObject,
    updateID_draft,
    clearID_draft
} = GeographicalObject.actions;

export default GeographicalObject.reducer;
