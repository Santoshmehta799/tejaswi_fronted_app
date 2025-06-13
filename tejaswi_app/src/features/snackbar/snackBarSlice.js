import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status: "",
    isOpen: false,
    message: "",
};

export const snackbarSlice = createSlice({
    name: "snackbar",
    initialState,
    reducers: {
        setSnackBarStatus: (state, action) => {
            state.status = action.payload.status;
            state.isOpen = action.payload.isOpen;
            state.message = action.payload.message;
        },
    },
});

export const { setSnackBarStatus } = snackbarSlice.actions;