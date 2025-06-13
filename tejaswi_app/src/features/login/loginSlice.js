import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

export const userLogin = createAsyncThunk(
    "login/login",
    async ({ userName, password }, thunkAPI) => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_KEY}/auth/login/`,
                { username: userName, password: password },
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


export const loginSlice = createSlice({
    name: "login",
    initialState: {
        status: "idle",
        user: null,
        error: null,
    },
    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(userLogin.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(userLogin.fulfilled, (state, action) => {
                state.status = "logged in";
                Cookies.set("role", action.payload.data.role);
                Cookies.set("access", action.payload.data.access_token);
                Cookies.set("refresh", action.payload.data.refresh_token);
                state.error = null;
            })
            .addCase(userLogin.rejected, (state, action) => {
                state.status = "error";
                state.error = action.payload.message;
            });
    },
});

export default loginSlice.reducer;