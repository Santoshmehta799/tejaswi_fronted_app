import { Alert, Snackbar } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setSnackBarStatus } from "../features/snackbar/snackBarSlice";


function SnackbarComponent() {
    const dispatch = useDispatch();
    const { status, isOpen, message } = useSelector((state) => state.snackbar);

    return (
        <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            open={isOpen}
            autoHideDuration={5000}
            sx={{
                "&.MuiSnackbar-root": {
                    top: "100px",
                },
            }}
            onClose={() => {
                dispatch(
                    setSnackBarStatus({
                        status: "",
                        isOpen: false,
                        message: "",
                    })
                );
            }}
        >
            <Alert
                onClose={() => {
                    dispatch(
                        setSnackBarStatus({
                            status: "",
                            isOpen: false,
                            message: "",
                        })
                    );
                }}
                severity={status}
                variant="filled"
                sx={{ width: "100%" }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
}

export default SnackbarComponent;