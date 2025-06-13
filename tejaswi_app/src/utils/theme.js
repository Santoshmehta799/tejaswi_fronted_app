import { createTheme } from "@mui/material";

const theme = createTheme({
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 900,
            lg: 1200,
            xl: 1536,
        },
    },
    palette: {
        primary: {
            main: "#2B2C40",
        },
        secondary: {
            main: "#FFFFFF",
        },
    },

});

export default theme;