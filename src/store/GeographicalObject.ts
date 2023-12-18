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
            // Упорядочиваем объекты по полю "feature"
            state.data.sort((a, b) => a.feature.localeCompare(b.feature));
        },
        updatePagination: (state, action) => {
            state.pagination = action.payload;
        },
        updateID_draft: (state, action) => {
            state.id_draft = action.payload === null ? -1 : action.payload;
        },
        clearID_draft: (state) => {
            state.id_draft = initialState.id_draft;
        },
        updatePhotoUrl: (state, action) => {
            const { id, photoUrl } = action.payload;
            const objectIndex = state.data.findIndex(obj => obj.id === id);

            if (objectIndex !== -1) {
                state.data[objectIndex].photo = photoUrl;
            }
        },
    },
});

export const {
    updateGeographicalObject,
    updatePagination,
    updateID_draft,
    clearID_draft,
    updatePhotoUrl
} = GeographicalObject.actions;

export default GeographicalObject.reducer;
