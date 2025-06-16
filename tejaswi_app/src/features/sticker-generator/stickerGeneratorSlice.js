import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";
import { refreshToken } from "../../utils/refreshToken";

export const createStickerGenerator = createAsyncThunk(
    "stickerGenerator/createStickerGenerator",
    async (data, thunkAPI) => {
        let token = Cookies.get("access");

        const makeRequest = async (token) => {
            return await axios.post(
                `${process.env.REACT_APP_API_KEY}/auth/sticker-generator/`,
                data,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
        };
        try {
            const response = await makeRequest(token);
            if (response.status === 200) {
                return response;
            }

        } catch (error) {
            if (error.response) {
                try {
                    token = await refreshToken();
                    const response = await makeRequest(token);

                    if (response.status === 200) {
                        return response;
                    }
                } catch (refresherror) {
                    return thunkAPI.rejectWithValue(refresherror.response);
                }
            } else {
                return thunkAPI.rejectWithValue(error.response);
            }
        }
    }
);

export const showStickerGenerator = createAsyncThunk(
    "stickerGenerator/showStickerGenerator",
    async (id, thunkAPI) => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_KEY}/auth/sticker-generator/${id}/qr-code/`,
                {
                    responseType: 'blob',
                    headers: {
                        'ngrok-skip-browser-warning': 'true'
                    }
                }
            );

            if (response.status === 200) {
                const imageUrl = URL.createObjectURL(response.data);
                return imageUrl;
            }

        } catch (error) {
            return thunkAPI.rejectWithValue(error.response);
        }
    }
);




export const stickerGeneratorSlice = createSlice({
    name: "stickerGenerator",
    initialState: {
        status: "idle",
        data: null,
        error: null,
    },
    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(createStickerGenerator.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(createStickerGenerator.fulfilled, (state, action) => {
                state.status = "success";
                state.data = action.payload.data
                state.error = null;
            })
            .addCase(createStickerGenerator.rejected, (state, action) => {
                state.status = "error";
                state.error = action.payload.message;
            });
    },
});

export default stickerGeneratorSlice.reducer;