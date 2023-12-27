import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import defaultImage from "../assets/mock.png";

interface GeographicalObjectEdit {
    id: number;
    feature: string;
    type: string;
    size: number;
    describe: string;
    photo: string;
    status: boolean;

}

const initialState: GeographicalObjectEdit = {
    id: -1,
    feature: "",
    type: "",
    size: -1,
    describe: "",
    photo: defaultImage,
    status: true,
};

const GeographicalObjectEdit = createSlice({
    name: "geographical_object_edit",
    initialState: initialState,
    reducers: {
        updateGeographicalObjectEdit: (state, action: PayloadAction<Partial<GeographicalObjectEdit>>) => {
            return { ...state, ...action.payload };
        },

    },
});

export const {
    updateGeographicalObjectEdit
} = GeographicalObjectEdit.actions;

export default GeographicalObjectEdit.reducer;
