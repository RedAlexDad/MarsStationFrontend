// Employee.ts
import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    id_draft: -1,
};

const IdDraftMarsStation = createSlice({
    name: "id_draft_mars_station",
    initialState: initialState,
    reducers: {
        // @ts-ignore
        updateID_draft: (state, action) => {
            state.id_draft = action.payload;
        },
        clearID_draft: (state) => {
            state.id_draft = initialState.id_draft;
        },
    },
});

export const {updateID_draft, clearID_draft} = IdDraftMarsStation.actions;

export default IdDraftMarsStation.reducer;