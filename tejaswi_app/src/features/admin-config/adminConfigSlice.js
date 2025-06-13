import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";
import { refreshToken } from "../../utils/refreshToken";

export const createAdminConfig = createAsyncThunk(
    "adminConfig/createAdminConfig",
    async (userData, thunkAPI) => {
        let token = Cookies.get("access");
        const { tradingName, textData } = userData

        const params = {
            config_type: tradingName,
            action: "create",
            name: textData
        }
        const makeRequest = async (token) => {
            return await axios.post(
                `${process.env.REACT_APP_API_KEY}/auth/admin-config/manage/`,
                params,
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

export const createColourAdminConfig = createAsyncThunk(
    "adminConfig/createColourAdminConfig",
    async ({ colourData, isChecked }, thunkAPI) => {
        let token = Cookies.get("access");
        const { colourInput, textColourData } = colourData

        const params = {
            config_type: colourInput,
            action: "create_colour",
            name: textColourData,
            is_white: isChecked
        }
        const makeRequest = async (token) => {
            return await axios.post(
                `${process.env.REACT_APP_API_KEY}/auth/admin-config/manage/`,
                params,
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

export const getAdminConfig = createAsyncThunk(
    "adminConfig/getAdminConfig",
    async (_, thunkAPI) => {
        let token = Cookies.get("access");

        const params = {
            config_type: "all",
            action: "list",
            name: ""
        }
        const makeRequest = async (token) => {
            return await axios.post(
                `${process.env.REACT_APP_API_KEY}/auth/admin-config/manage/`,
                params,
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

export const getColorUpdateAdminConfig = createAsyncThunk(
    "adminConfig/getColorUpdateAdminConfig",
    async (updatedItem, thunkAPI) => {
        let token = Cookies.get("access");
        const { is_white, id } = updatedItem

        const params = {
            config_type: "colour",
            action: "update_colour",
            id: id,
            is_white: is_white
        }
        const makeRequest = async (token) => {
            return await axios.post(
                `${process.env.REACT_APP_API_KEY}/auth/admin-config/manage/`,
                params,
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

export const deleteAdminConfig = createAsyncThunk(
    "adminConfig/deleteAdminConfig",
    async (item, thunkAPI) => {
        let token = Cookies.get("access");
        const { config_type, id } = item

        const params = {
            config_type: config_type,
            action: "delete",
            item_id: id
        }
        const makeRequest = async (token) => {
            return await axios.post(
                `${process.env.REACT_APP_API_KEY}/auth/admin-config/manage/`,
                params,
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



export const adminConfigSlice = createSlice({
    name: "adminConfig",
    initialState: {
        status: "idle",
        data: null,
        error: null,
    },
    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(getAdminConfig.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(getAdminConfig.fulfilled, (state, action) => {
                state.status = "success";
                state.data = action.payload.data.data
                state.error = null;
            })
            .addCase(getAdminConfig.rejected, (state, action) => {
                state.status = "error";
                state.error = action.payload.message;
            });
    },
});

export default adminConfigSlice.reducer;