import {createSlice} from "@reduxjs/toolkit";

interface MarsStation {
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
        describe: string;
        photo: string;
        status: boolean;
    }[];
}


const initialState: MarsStation = {
    id: -1,
    type_status: "",
    date_create: "",
    date_form: "",
    date_close: "",
    status_task: "",
    status_mission: "",
    employee: {
        id: -1,
        full_name: "",
        post: "",
        name_organization: "",
        address: "",
        id_user: -1,
    },
    moderator: {
        id: -1,
        full_name: "",
        post: "",
        name_organization: "",
        address: "",
        id_user: -1,
    },
    transport: {
        id: -1,
        name: "",
        type: "",
        describe: "",
        photo: "",
    },
    location: [],
    geographical_object: [],
};

const MarsStationDraft = createSlice({
    name: "mars_station_draft",
    initialState: initialState,
    reducers: { 
        updateMarsStationDraft: (state, action) => {
            return {
                ...state,
                ...action.payload,
                employee: { ...state.employee, ...action.payload.employee },
                moderator: { ...state.moderator, ...action.payload.moderator },
                transport: { ...state.transport, ...action.payload.transport },
            };
        },
        updateMarsStationDraftData: (state, action) => {
            return {
                ...state,
                geographical_object: action.payload.geographical_object,
                location: action.payload.location
            };
        },
        cleanDraft: () => initialState,
    },
});

export const {
    updateMarsStationDraft,
    updateMarsStationDraftData,
    cleanDraft,
} = MarsStationDraft.actions;

export default MarsStationDraft.reducer;