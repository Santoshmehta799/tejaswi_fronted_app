import { configureStore } from "@reduxjs/toolkit";
import { loginSlice } from "../features/login/loginSlice";
import { registerSlice } from "../features/register/registerSlice";
import { stickerGeneratorDroplistSlice } from "../features/utils/stickerGeneratorDroplistSlice";
import { stickerGeneratorSlice } from "../features/sticker-generator/stickerGeneratorSlice";
import { adminConfigSlice } from "../features/admin-config/adminConfigSlice";
import { inventorySlice } from "../features/inventory/inventorySlice";
import { dispatchSlice } from "../features/dispatch/dispatchSlice";
import { snackbarSlice } from "../features/snackbar/snackBarSlice";

const store = configureStore({
    reducer: {
        snackbar: snackbarSlice.reducer,
        login: loginSlice.reducer,
        register: registerSlice.reducer,
        stickerGeneratorDrop: stickerGeneratorDroplistSlice.reducer,
        stickerGenerator: stickerGeneratorSlice.reducer,
        adminConfig: adminConfigSlice.reducer,
        inventory: inventorySlice.reducer,
        dispatch: dispatchSlice.reducer,

    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),

});

export default store;