import {
    Box,
    IconButton,
    List,
    ListItemButton,
    ListItemText,
    SwipeableDrawer,
    useMediaQuery,
} from "@mui/material";
import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";
import theme from "../utils/theme";
import { getNavbarContext } from "../utils/textUtils";


const BoxContainer = styled(Box)(({ theme }) => ({
    width: 270,
}));

const BodyContainer = styled(Box)(({ theme }) => ({
    padding: "0px 14px",
}));

function DrawerComponent({ isOpen, setIsOpen }) {
    const [activeLink, setActiveLink] = useState(null);
    const { links } = getNavbarContext();


    const matches = useMediaQuery(theme.breakpoints.down("md"));

    const handleMenuClick = (title) => {
        setActiveLink(title);

        if (matches) {
            setIsOpen(false);
        }
    };

    return (
        <SwipeableDrawer
            open={isOpen}
            onClose={() => setIsOpen(false)}
            onOpen={() => {
                return null;
            }}
            sx={{
                "& .MuiDrawer-paper": {
                    background: theme.palette.primary.main,
                },
            }}
        >
            <BoxContainer>
                <BodyContainer>
                    <List>
                        {links.map((data, index) => (
                            <Link
                                to={data.path}
                                style={{
                                    textDecoration: "none",
                                }}
                                key={index}
                            >
                                <ListItemButton
                                    sx={{
                                        borderRadius: "7px",
                                        backgroundColor:
                                            activeLink === data.title ? "#f0f0f0" : "transparent",
                                        color:
                                            activeLink === data.title ? "#1976d2" : "#E5E5E8",
                                        display: "flex",
                                        justifyContent: "flex-start",
                                        alignItems: "center",
                                        "&:hover": {
                                            backgroundColor: isOpen
                                                ? theme.palette.primary.dark
                                                : "transparent",
                                        },
                                    }}
                                    onClick={() => handleMenuClick(data.path)}
                                >
                                    <IconButton sx={{ color: "#E5E5E8" }}>
                                        {data.icon}
                                    </IconButton>

                                    <ListItemText
                                        primary={data.title}
                                        sx={{ marginLeft: "10px", color: "#E5E5E8" }}
                                    />
                                </ListItemButton>
                            </Link>
                        ))}
                    </List>
                </BodyContainer>
            </BoxContainer>
        </SwipeableDrawer>
    );
}

export default DrawerComponent;