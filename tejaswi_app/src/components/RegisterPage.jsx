import { Box, Button, InputLabel, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import { registerUser } from "../features/register/registerSlice";
import { useDispatch } from "react-redux";
import { setSnackBarStatus } from "../features/snackbar/snackBarSlice";

const Container = styled(Box)(({ theme }) => ({
    width: "100%",
    height: "calc(100vh - 70px)",
    background: "#06060",
}));

const InnerContainer = styled(Box)(({ theme }) => ({}));

const MiddleContainer = styled(Box)(({ theme }) => ({
    borderRadius: "10px",
    boxShadow: theme.shadows[4],
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    maxWidth: "500px",
    width: "90%",
    padding: theme.spacing(3),
    background: "#fff",
    boxSizing: "border-box",
}));

const FormContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2),
}));

const SelectContainer = styled(Select)(({ theme }) => ({
    fontSize: "14px",
    width: "100%",
    "& .MuiOutlinedInput-input": {
        padding: "10px",
    },
}));

const Title = styled(Typography)(({ theme }) => ({
    fontWeight: 600,
    fontSize: "28px",
    color: "#060606",
    lineHeight: "1.2",
    marginBottom: theme.spacing(2),
}));

const InputLabelComponent = styled(InputLabel)(({ theme }) => ({
    fontSize: "16px",
    color: "#060606",
    fontWeight: 600,
    marginBottom: theme.spacing(1),
}));

const InputComponent = styled(TextField)(({ theme }) => ({
    "& .MuiOutlinedInput-input": {
        padding: "10px 14px",
    },
}));


const RegisterButton = styled(Button)(({ theme }) => ({
    textTransform: "capitalize",
    padding: "10px",
}));


function RegisterPage() {
    const dispatch = useDispatch()
    const [isLoading, setIsLoading] = useState(false);
    const [userData, setUserData] = useState({
        userName: "",
        password: "",
        role: ""
    });


    const handleChange = (e) => {
        const { name, value } = e.target
        setUserData({
            ...userData,
            [name]: value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await dispatch(registerUser(userData)).unwrap();
            if (response.status === 200) {
                dispatch(
                    setSnackBarStatus({
                        status: "success",
                        isOpen: true,
                        message: `🎉 User created successfully!`,
                    })
                );

                setIsLoading(false);
                setUserData({
                    userName: "",
                    password: "",
                    role: ""
                })
            }
        } catch (error) {
            dispatch(
                setSnackBarStatus({
                    status: "error",
                    isOpen: true,
                    message: error?.data?.detail,
                })
            );
            setIsLoading(false);
        }

    };

    return (
        <Container>
            <InnerContainer>
                <MiddleContainer>
                    <Title component="h2" textAlign="center">
                        Register User
                    </Title>
                    <FormContainer component="form" onSubmit={handleSubmit}>
                        <Stack direction="column">
                            <InputLabelComponent>User Name*</InputLabelComponent>
                            <InputComponent
                                required
                                type="text"
                                name="userName"
                                value={userData.userName}
                                placeholder="Enter User Name"
                                onChange={handleChange}
                            />
                        </Stack>
                        <Stack direction="column">
                            <InputLabelComponent>Password*</InputLabelComponent>
                            <InputComponent
                                required
                                type="password"
                                name="password"
                                value={userData.password}
                                placeholder="Enter password"
                                onChange={handleChange}
                            />
                        </Stack>
                        <Stack direction="column">
                            <InputLabelComponent>Role*</InputLabelComponent>
                            <SelectContainer
                                defaultValue="none"
                                required
                                fullWidth
                                name="role"
                                onChange={handleChange}
                            >
                                <MenuItem value="none" disabled>  Select Role </MenuItem>
                                <MenuItem value="admin_user">Admin</MenuItem>
                                <MenuItem value="sticker_guys">Sticker User</MenuItem>
                                <MenuItem value="dispatch_guys">Dispatch User</MenuItem>
                            </SelectContainer>

                        </Stack>

                        <RegisterButton
                            variant="contained"
                            fullWidth
                            type="submit"
                            color="primary"
                            loading={isLoading}
                        >
                            Sign Up
                        </RegisterButton>
                    </FormContainer>
                </MiddleContainer>

            </InnerContainer>
        </Container>
    )
}

export default RegisterPage