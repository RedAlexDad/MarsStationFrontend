// Employee.ts
import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    id_employee: -1,
    full_name: "",
    post: "",
    name_organization: "",
    address: "",
};

const employee = createSlice({
    name: "employee",
    initialState: initialState,
    reducers: {
        updateEmployee: (state, action) => {
            Object.assign(state, action.payload);
        },
        cleanEmployee: (state) => {
            Object.assign(state, initialState);
        },
    },
});

export const {updateEmployee, cleanEmployee} = employee.actions;

export default employee.reducer;