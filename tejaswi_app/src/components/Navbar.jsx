import {
    Avatar,
    Box,
    IconButton,
    Stack,
    Menu,
    Divider,
    useMediaQuery,
    Typography,
    Button,
} from "@mui/material";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { styled } from "@mui/material/styles";
import theme from "../utils/theme";
import { MdOutlineEmail } from "react-icons/md";

const Container = styled(Box)({
    width: "-webkit-fill-available",
    position: "fixed",
    top: 0,
    zIndex: 2,
    background: "#FFFFFF",
    borderBottom: "1px solid #E5E5E8",
});

const InnerContainer = styled(Box)({
    width: "90%",
    margin: "auto",
    height: "70px",
    display: "flex",
    justifyContent: "end",
    alignItems: "center",
    boxSizing: "border-box",
});

const UserCardContainer = styled(Box)(({ theme }) => ({
    maxWidth: "360px",
    height: "100%",
    padding: `${theme.spacing(2)} ${theme.spacing(3)}`,
    [theme.breakpoints.down("sm")]: {
        boxSizing: "border-box",
        padding: `${theme.spacing(1)} ${theme.spacing(1)}`,
    },
}));

const UserContainerTitle = styled(Typography)(({ theme }) => ({
    fontSize: "18px",
    fontWeight: 600,
    lineHeight: "26px",
}));

const UserDetailsContainer = styled(Box)(({ theme }) => ({
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.down("sm")]: {
        marginLeft: "0px",
    },
}));

const Username = styled(Typography)(({ theme }) => ({
    fontSize: "14px",
    fontWeight: 600,
    lineHeight: "22px",
}));

const Designation = styled(Typography)(({ theme }) => ({
    fontSize: "14px",
    fontWeight: 400,
    lineHeight: "22px",
}));

const Email = styled(Typography)(({ theme }) => ({
    fontSize: "14px",
    fontWeight: 400,
    lineHeight: "22px",
    display: "flex",
    alignItems: "center",
}));

const LogoutBtn = styled(Button)(({ theme }) => ({
    width: "100%",
    height: "100%",
    marginTop: `${theme.spacing(3)}`,
}));

const UserCard = () => {
    const navigate = useNavigate();
    const matches = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <UserCardContainer>
            <UserContainerTitle>User Profile</UserContainerTitle>
            <Stack
                sx={{
                    padding: `${theme.spacing(3)} 0px`,
                    [theme.breakpoints.down("sm")]: {
                        paddingTop: theme.spacing(1.5),
                    },
                }}
                direction={matches ? "column" : "row"}
                alignItems="center"
            >
                <UserDetailsContainer>
                    <Username>Tejaswi</Username>
                    <Designation>Role: Onwer</Designation>
                    <Email>
                        <MdOutlineEmail sx={{ fontSize: "16px", mr: 0.5 }} />
                        Tejaswi@gmail.com
                    </Email>
                </UserDetailsContainer>
            </Stack>
            <Divider />
            <LogoutBtn
                color="error"
                variant="outlined"
                onClick={() => {
                    Cookies.remove("access");
                    Cookies.remove("refresh");
                    navigate("/login");
                }}
            >
                Logout
            </LogoutBtn>
        </UserCardContainer>
    );
};

function Navbar() {
    const [anchorElAccount, setAnchorElAccount] = useState(null);
    const openAccount = Boolean(anchorElAccount);

    const handleAccountClick = (event) => {
        setAnchorElAccount(event.currentTarget);
    };

    const handleAccountClose = () => {
        setAnchorElAccount(null);
    };


    return (
        <>
            <Container>
                <InnerContainer>
                    <Stack direction="row" spacing={2} >
                        <IconButton
                            sx={{ padding: "0px" }}
                            onClick={handleAccountClick}
                            size="small"
                        >
                            <Avatar />
                        </IconButton>
                        <Menu
                            anchorEl={anchorElAccount}
                            id="account-menu"
                            open={openAccount}
                            onClose={handleAccountClose}
                            onClick={handleAccountClose}
                            sx={{
                                "& .MuiMenu-list": {
                                    padding: "16px",
                                    display: "flex",
                                    justifyContent: "center",
                                },
                            }}
                            slotProps={{
                                paper: {
                                    elevation: 0,
                                    sx: {
                                        overflow: "visible",
                                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                                        mt: 1.5,
                                        borderRadius: "7px",
                                        "& .MuiAvatar-root": {
                                            width: 32,
                                            height: 32,
                                            ml: -0.5,
                                            mr: 1,
                                        },
                                        "&::before": {
                                            content: '""',
                                            display: "block",
                                            position: "absolute",
                                            top: 0,
                                            right: 15,
                                            width: 10,
                                            height: 10,
                                            bgcolor: "background.paper",
                                            transform: "translateY(-50%) rotate(45deg)",
                                            zIndex: 0,
                                        },
                                    },
                                },
                            }}
                            transformOrigin={{ horizontal: "right", vertical: "top" }}
                            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                        >
                            <UserCard />
                        </Menu>
                    </Stack>
                </InnerContainer>
            </Container>
        </>
    );
}

export default Navbar;