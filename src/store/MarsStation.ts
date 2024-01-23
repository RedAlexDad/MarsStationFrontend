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
            address: string | null;
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
            describe: string | null;
            photo: string | null;
            status: boolean;
        }[];
    }[];
    info: {
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
            address: string | null;
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
            describe: string | null;
            photo: string | null;
            status: boolean;
        }
    }
    pagination: {
        currentPage: number;
        totalPages: number;
        count: number;
    };
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
    },],
    info: {
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
    },
    pagination: {
        currentPage: 1,
        totalPages: 1,
        count: 0,
    },
};

const MarsStation = createSlice({
    name: "mars_station",
    initialState: initialState,
    reducers: {
        updateMarsStation: (state, action) => {
            state.data = action.payload;
        },
        updateMarsStationInfo: (state, action) => {
            state.info = action.payload;
        },
        updatePagination: (state, action) => {
            state.pagination = action.payload;
        },
        clean: () => {
            return initialState;
        },
    },
});

export const {
    updateMarsStation,
    updateMarsStationInfo,
    updatePagination,
    clean,
} = MarsStation.actions;

export default MarsStation.reducer;