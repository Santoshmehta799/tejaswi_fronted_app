import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";
import { refreshToken } from "../../utils/refreshToken";


export const createDispatchData = createAsyncThunk(
    "dispatch/createDispatchData",
    async (data, thunkAPI) => {
        let token = Cookies.get("access");

        const makeRequest = async (token) => {
            return await axios.post(
                `${process.env.REACT_APP_API_KEY}/auth/dispatch-manager/`,
                data, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
            );
        };
        try {
            const response = await makeRequest(token);
            console.log(response);

            if (response.status === 200) {
                return response;
            }

        } catch (error) {
            if (error.response && error.response.status === 403) {
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


export const getDispatchData = createAsyncThunk(
    "dispatch/getDispatchData",
    async (_, thunkAPI) => {
        let token = Cookies.get("access");

        const makeRequest = async (token) => {
            return await axios.get(
                `${process.env.REACT_APP_API_KEY}/auth/scanned-products/`,
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
            if (error.response && error.response.status === 403) {
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

export const getDispatchHistoryData = createAsyncThunk(
    "dispatch/getDispatchHistoryData",
    async (params = {}, thunkAPI) => {
        let token = Cookies.get("access");

        const { startDate, endDate } = params;
        const query = startDate && endDate
            ? `?start_date=${startDate}&end_date=${endDate}`
            : "";

        const makeRequest = async (token) => {
            return await axios.get(
                `${process.env.REACT_APP_API_KEY}/auth/dispatch-manager/history/${query}`,
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
            if (error.response && error.response.status === 403) {
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

export const getDispatchQrData = createAsyncThunk(
    "dispatch/getDispatchQrData",
    async (product_Id, thunkAPI) => {
        let token = Cookies.get("access");

        const makeRequest = async (token) => {
            return await axios.get(
                `${process.env.REACT_APP_API_KEY}/auth/scan-qr-code/?product_number=${product_Id}`,
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
            if (error.response && error.response.status === 403) {
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

export const deleteDispatchData = createAsyncThunk(
    "dispatch/deleteDispatchData",
    async (product_number, thunkAPI) => {
        let token = Cookies.get("access");

        const makeRequest = async (token) => {
            return await axios.delete(
                `${process.env.REACT_APP_API_KEY}/auth/scanned-products/${product_number}`,
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
                return { response, product_number };
            }

        } catch (error) {
            if (error.response && error.response.status === 403) {
                try {
                    token = await refreshToken();
                    const response = await makeRequest(token);

                    if (response.status === 200) {
                        return { response, product_number };
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

export const dispatchSlice = createSlice({
    name: "dispatch",
    initialState: {
        status: "idle",
        data: null,
        dispatchData: null,
        error: null,
    },
    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(getDispatchData.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(getDispatchData.fulfilled, (state, action) => {
                state.status = "success";
                state.data = action.payload.data
                state.error = null;
            })
            .addCase(getDispatchData.rejected, (state, action) => {
                state.status = "error";
                state.error = action.payload.message;
            })
            .addCase(getDispatchHistoryData.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(getDispatchHistoryData.fulfilled, (state, action) => {
                state.status = "success";
                state.dispatchData = action.payload.data
                state.error = null;
            })
            .addCase(getDispatchHistoryData.rejected, (state, action) => {
                state.status = "error";
                state.error = action.payload.message;
            })
            .addCase(deleteDispatchData.fulfilled, (state, action) => {

                state.status = "success";
                state.data =
                    state.data.filter(
                        (item) => item.product_number !== action.payload.product_number
                    );
                state.error = null;
            })
            .addCase(deleteDispatchData.rejected, (state, action) => {
                state.status = "error";
                state.error = action.payload?.message || action.error.message;
            });
    },
});

export default dispatchSlice.reducer;