import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";
import { refreshToken } from "../../utils/refreshToken";

export const getInventory = createAsyncThunk(
    "inventory/getInventory",
    async (_, thunkAPI) => {
        let token = Cookies.get("access");

        const makeRequest = async (token) => {
            return await axios.get(
                `${process.env.REACT_APP_API_KEY}/auth/inventory/records`,
                {
                    headers: {
                        'ngrok-skip-browser-warning': 'true',
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

export const updateInventory = createAsyncThunk(
    "inventory/updateInventory",
    async ({ id, inventoryData }, thunkAPI) => {
        let token = Cookies.get("access");

        const makeRequest = async (token) => {
            return await axios.put(
                `${process.env.REACT_APP_API_KEY}/auth/sticker-generator/update/${id}/`,
                inventoryData, {
                headers: {
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

export const showInventorySticker = createAsyncThunk(
    "inventory/showInventorySticker",
    async ({ id }, thunkAPI) => {
        try {
            let token = Cookies.get("access");
            const response = await axios.get(
                `${process.env.REACT_APP_API_KEY}/auth/inventroy-data/${id}/qr-code/`,
                {

                    headers: {
                        'ngrok-skip-browser-warning': 'true',
                        Authorization: `Bearer ${token}`,
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

export const deleteInventory = createAsyncThunk(
    "inventory/deleteInventory",
    async ({ id }, thunkAPI) => {
        let token = Cookies.get("access");

        const makeRequest = async (token) => {
            return await axios.delete(
                `${process.env.REACT_APP_API_KEY}/auth/delete-sticker/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
        };
        try {
            const response = await makeRequest(token);
            if (response.status === 200) {
                return { response, id };
            }

        } catch (error) {
            if (error.response) {
                try {
                    token = await refreshToken();
                    const response = await makeRequest(token);

                    if (response.status === 200) {
                        return { response, id };
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

export const inventorySlice = createSlice({
    name: "inventory",
    initialState: {
        status: "idle",
        data: null,
        items: null,
        error: null,
    },
    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(getInventory.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(getInventory.fulfilled, (state, action) => {
                state.status = "success";
                state.data = action.payload.data
                state.error = null;
            })
            .addCase(getInventory.rejected, (state, action) => {
                state.status = "error";
                state.error = action.payload.message;
            })
            .addCase(showInventorySticker.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(showInventorySticker.fulfilled, (state, action) => {
                state.status = "success";
                state.items = action.payload.data
                state.error = null;
            })
            .addCase(showInventorySticker.rejected, (state, action) => {
                state.status = "error";
                state.error = action.payload.message;
            })
            .addCase(deleteInventory.fulfilled, (state, action) => {
                state.status = "success";
                state.data =
                    state.data.filter(
                        (item) => item.product_code !== action.payload.id
                    );
                state.error = null;
            })
            .addCase(deleteInventory.rejected, (state, action) => {
                state.status = "error";
                state.error = action.payload?.message || action.error.message;
            });
    },
});

export default inventorySlice.reducer;