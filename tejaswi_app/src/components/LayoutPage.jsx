import React, { useState } from 'react'
import { styled } from "@mui/material/styles";
import { Box, IconButton, List, ListItemButton, ListItemText } from '@mui/material';
import { getNavbarContext } from '../utils/textUtils';
import { Link, Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import theme from '../utils/theme';

const Container = styled(Box)(({ theme }) => ({
    width: "100%",
    height: "max-content",
}));

const InnerContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    height: "100%",
}));

const SideNavContainer = styled(Box)(({ open, theme }) => ({
    width: open ? "270px" : "87px",
    background: theme.palette.primary.main,
    borderRight: "1px solid #dfdfdf",
    position: "fixed",
    top: 0,
    height: "100vh",
    overflowY: "auto",
    transition: "width 0.3s",
    boxSizing: "border-box",
    [theme.breakpoints.down("md")]: {
        display: "none",
    },
}));


const BodyContainer = styled(Box)(({ theme }) => ({
    padding: "0px 14px",
}));

const PageContainer = styled(Box)(({ open, theme }) => ({
    marginLeft: open ? "270px" : "87px",
    transition: "margin-left 0.3s",
    width: "-webkit-fill-available",
    height: "max-content",
    padding: "70px 0 0 0",
    [theme.breakpoints.down("md")]: {
        marginLeft: "0px",
    },
}));


function LayoutPage() {
    const [open, setOpen] = useState(true);
    const [activeLink, setActiveLink] = useState(null);
    const { links } = getNavbarContext();
    const handleDrawerToggle = () => {
        setOpen((prev) => !prev);
    };

    const handleMenuClick = (event) => {
        setActiveLink(event);
    };

    return (
        <Container>
            <InnerContainer>
                <SideNavContainer open={open}>
                    <BodyContainer>
                        <List sx={{ marginTop: "24px" }}>
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
                                                activeLink === data.path
                                                    ? "#212130"
                                                    : "transparent",
                                            color:
                                                activeLink === data.path
                                                    ? "#E5E5E8"
                                                    : "transparent",
                                            display: "flex",
                                            justifyContent: "flex-start",
                                            alignItems: "center",
                                            "&:hover": {
                                                backgroundColor: open
                                                    ? theme.palette.primary.dark
                                                    : "transparent",
                                            },
                                            "&.MuiButtonBase-root": {
                                                paddingLeft: "11px",
                                            },
                                        }}
                                        onClick={() => handleMenuClick(data.path)}
                                    >
                                        <IconButton sx={{ color: "#E5E5E8" }} disableRipple>
                                            {data.icon}
                                        </IconButton>
                                        {open && (
                                            <ListItemText
                                                primary={data.title}
                                                sx={{ marginLeft: "10px", color: "#E5E5E8" }}
                                            />
                                        )}
                                    </ListItemButton>
                                </Link>
                            ))}
                        </List>
                    </BodyContainer>
                </SideNavContainer>

                <PageContainer open={open}>
                    <Navbar onToggleDrawer={handleDrawerToggle} />
                    <Outlet />
                </PageContainer>
            </InnerContainer>
        </Container>
    )
}

export default LayoutPage
