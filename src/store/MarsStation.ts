import {createSlice} from "@reduxjs/toolkit";

interface MarsStation {
    data: {
        id: number;
        type_status: string;
        date_create: string;
        date_form: string;
        date_close: string;
        status_task: string;
        status_mission: string;
        employee: {
            id: number;
            full_name: string;
            post: string;
            name_organization: string;
            address: string| null;
            id_user: number;
        };
        moderator: {
            id: number;
            full_name: string;
            post: string;
            name_organization: string;
            address: string;
            id_user: number;
        };
        transport: {
            id: number;
            name: string;
            type: string;
            describe: string | null;
            photo: string | null;
        };
        location: {
            id: number;
            sequence_number: number;
            id_geographical_object: number;
            id_mars_station: number;
        }[];
        geographical_object: {
            id: number;
            feature: string;
            type: string;
            size: number;
            describe: string| null;
            photo: string| null;
            status: boolean;
        }[];
    }[];
    pagination: {
        currentPage: number;
        totalPages: number;
        count: number;
    };
    id_draft: number;
}

const initialState: MarsStation = {
    data: [{
            id: -1,
            type_status: "",
            date_create: "",
            date_form: "",
            date_close: "",
            status_task: "",
            status_mission: "",
            employee: {},
            moderator: {},
            transport: {},
            location: [],
            geographical_object: [],
        },],
    pagination: {
        currentPage: 1,
        totalPages: 1,
        count: 0,
    },
    id_draft: -1,
};

const MarsStation = createSlice({
    name: "mars_station",
    initialState: initialState,
    reducers: {
        // @ts-ignore
        updateMarsStation: (state, action) => {
            state.data = action.payload;
        },
        updatePagination: (state, action) => {
            state.pagination = action.payload;
        },
        // @ts-ignore
        clean: (state) => {
            return initialState;
        },
        // @ts-ignore
        updateID_draft: (state, action) => {
            state.id_draft = action.payload;
        },
        clearID_draft: (state) => {
            state.id_draft = initialState.id_draft;
        },
    },
});

export const {
    updateMarsStation,
    updatePagination,
    clean,
    updateID_draft,
    clearID_draft
} = MarsStation.actions;

export default MarsStation.reducer;