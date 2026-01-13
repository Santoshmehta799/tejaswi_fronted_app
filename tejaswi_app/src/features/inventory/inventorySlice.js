import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";
import { refreshToken } from "../../utils/refreshToken";


export const getInventory = createAsyncThunk(
    "inventory/getInventory",
    async ({ page = 1, limit = 20, search = "" }, thunkAPI) => {
        let token = Cookies.get("access");

        const makeRequest = async (token) => {
            const params = { page, limit };
            if (search) params.product_number = search;

            return await axios.get(
                `${process.env.REACT_APP_API_KEY}/auth/inventory/records`,
                {
                    params,
                    headers: {
                        "ngrok-skip-browser-warning": "true",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
        };

        try {
            const response = await makeRequest(token);
            if (response.status === 200) {
                return response.data;
            }
        } catch (error) {
            if (error.response) {
                try {
                    token = await refreshToken();
                    const response = await makeRequest(token);
                    if (response.status === 200) {
                        return response.data;
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
        results: [],
        totalPages: 0,
        currentPage: 1,
        totalCount: 0,
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
                state.results = action.payload.results;
                state.totalPages = action.payload.total_pages;
                state.currentPage = action.payload.current_page;
                state.totalCount = action.payload.total_count;
                state.error = null;
            })
            .addCase(getInventory.rejected, (state, action) => {
                state.status = "error";
                state.error = action.payload?.message || action.error.message;
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