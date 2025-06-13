import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const registerUser = createAsyncThunk(
    "registerUser/registerUser",
    async ({ userName, password, role }, thunkAPI) => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_KEY}/auth/users/`,
                { username: userName, password: password, role: role },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response.status === 200) {
                return response;
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response);
        }
    }
);


export const registerSlice = createSlice({
    name: "registerUser",
    initialState: {
        status: "idle",
        users: null,
        error: null,
    },
    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.status = "success";
                state.users = action.payload
                state.error = null;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.status = "error";
                state.error = action.payload.message;
            });
    },
});

export default registerSlice.reducer;