import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const stickerGeneratorDroplist = createAsyncThunk(
    "stickerGeneratorDrop/stickerGeneratorDroplist",
    async (_, thunkAPI) => {
        try {

            const response = await axios.get(
                `${process.env.REACT_APP_API_KEY}/auth/master-names/`,
                {
                    headers: {
                        'ngrok-skip-browser-warning': 'true'
                    }
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




export const stickerGeneratorDroplistSlice = createSlice({
    name: "stickerGeneratorDrop",
    initialState: {
        status: "idle",
        droplist: null,
        error: null,
    },
    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(stickerGeneratorDroplist.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(stickerGeneratorDroplist.fulfilled, (state, action) => {
                state.status = "success";
                state.droplist = action.payload.data
                state.error = null;
            })
            .addCase(stickerGeneratorDroplist.rejected, (state, action) => {
                state.status = "error";
                state.error = action.payload.message;
            });
    },
});

export default stickerGeneratorDroplistSlice.reducer;