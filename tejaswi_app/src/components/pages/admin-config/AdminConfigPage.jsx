import { Box, Button, Grid, IconButton, MenuItem, Paper, Select, Stack, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useEffect, useRef, useState } from 'react';
import { MdOutlineDeleteOutline } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { createAdminConfig, createColourAdminConfig, deleteAdminConfig, getAdminConfig, getColorUpdateAdminConfig } from '../../../features/admin-config/adminConfigSlice';

const Container = styled(Box)(({ theme }) => ({
    width: "100%",
    height: "max-content",
    background: "#06060",
    padding: "30px 0px",
}));


const InnerContainer = styled(Box)(({ theme }) => ({
    width: "90%",
    margin: "auto",
}));

const BoxContainer = styled(Paper)(({ theme }) => ({
    padding: "20px"
}));

const Header = styled(Box)(({ theme }) => ({
    marginBottom: "30px"
}));

const Title = styled(Typography)(({ theme }) => ({
    fontSize: "20px",
    fontWeight: 600,
}));

const SelectContainer = styled(Select)(({ theme }) => ({
    fontSize: "14px",
    width: "100%",
    "& .MuiOutlinedInput-input": {
        padding: "10px",
    },
}));

const InputComponent = styled(TextField)(({ theme }) => ({
    fontSize: "14px",
    "& .MuiOutlinedInput-input": {
        padding: "10px",
        fontSize: "14px",
    },
    "& .MuiInputBase-input::placeholder": {
        fontSize: "14px",
        color: "#000",
    },
}));

const TableContainerComponent = styled(TableContainer)(({ theme }) => ({
    marginTop: "30px",
    background: "#FFFFFF",
    borderRadius: "5px",
}));

const TableCellComponent = styled(TableCell)(({ theme }) => ({
    fontSize: "14px",
    fontWeight: 500,
    color: "#E5E5E8",
    padding: "12px 25px",
    whiteSpace: "nowrap",
}));

const TableCellContainer = styled(TableCell)(({ theme }) => ({}));


function AdminConfigPage() {
    const runFunction = useRef(false)
    const dispatch = useDispatch()
    const [isLoading, setIsLoading] = useState(false);
    const [isLoader, setIsLoader] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [userData, setUserData] = useState({
        tradingName: "",
        textData: "",
    });
    const [colourData, setColourData] = useState({
        colourInput: "colour",
        textColourData: ""
    });

    const { data } = useSelector((state) => state.adminConfig)

    const handleColourSwitchChange = async (item) => {
        const updatedItem = {
            ...item,
            is_white: !item.is_white,
        };

        try {

            const response = await dispatch(getColorUpdateAdminConfig(updatedItem)).unwrap();
            if (response.status === 200) {
                dispatch(getAdminConfig());
            }
        } catch (error) {
            console.error("Failed to update colour switch:", error);
        }
    };




    const handleSwitchChange = (event) => {
        setIsChecked(event.target.checked);
    };

    const handleChange = (e) => {
        const { name, value } = e.target
        setUserData({
            ...userData,
            [name]: value
        })
    }

    const handlecolourChange = (e) => {
        const { name, value } = e.target
        setColourData({
            ...colourData,
            [name]: value
        })
    }


    const handleColourSubmit = async (e) => {
        e.preventDefault();
        setIsLoader(true);
        try {
            const response = await dispatch(createColourAdminConfig({ colourData, isChecked })).unwrap();
            if (response.status === 200) {
                dispatch(getAdminConfig())
            }
            setColourData({
                ...colourData,
                textColourData: ""
            })
            setIsLoader(false);
        } catch (error) {
            console.error(error)
            setIsLoader(false);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await dispatch(createAdminConfig(userData)).unwrap();
            if (response.status === 200) {
                dispatch(getAdminConfig())
            }

            setUserData({
                ...userData,
                textData: "",
            });
            setIsLoading(false);
        } catch (error) {
            console.error(error)
            setIsLoading(false);
        }
    }

    const handleDelete = async (item) => {
        try {
            const response = await dispatch(deleteAdminConfig(item)).unwrap();
            if (response.status === 200) {
                dispatch(getAdminConfig())
            }
        } catch (error) {
            console.error(error)
        }

    }

    useEffect(() => {
        if (!runFunction.current) {
            dispatch(getAdminConfig())
            runFunction.current = true
        }
    }, [dispatch])

    return (
        <Container><InnerContainer>
            <BoxContainer elevation={2}>
                <Header>
                    <Title>Admin Configuration</Title>
                </Header>
                <Box component="form" onSubmit={handleSubmit} sx={{ marginBottom: "16px" }}>
                    <Grid container spacing={3}>
                        <Grid item size={{ xs: 12, md: 4, lg: 3 }}>
                            <SelectContainer
                                defaultValue="none"
                                required
                                fullWidth
                                name="tradingName"
                                onChange={handleChange}
                            >
                                <MenuItem value="none" disabled>
                                    Select Type
                                </MenuItem>
                                <MenuItem value="quality">Quality</MenuItem>
                                <MenuItem value="product_type">Product Type</MenuItem>
                                <MenuItem value="storage_location">Storage Location</MenuItem>
                            </SelectContainer>
                        </Grid>



                        <Grid item size={{ xs: 12, md: 7, lg: 8 }}>
                            <InputComponent
                                type="text"
                                placeholder="Enter Name"
                                fullWidth
                                required
                                name="textData"
                                value={userData.textData}
                                onChange={handleChange}
                            />
                        </Grid>


                        <Grid item size={{ xs: 12, md: 1, lg: 1 }}>
                            <Stack direction="row" justifyContent="end">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{ textTransform: "capitalize" }}
                                    type="submit"
                                    loading={isLoading}
                                > Add
                                </Button>
                            </Stack>
                        </Grid>
                    </Grid>
                </Box>

                <Box component="form" onSubmit={handleColourSubmit} >
                    <Grid container spacing={3}>
                        <Grid item size={{ xs: 12, md: 4, lg: 3 }}>
                            <SelectContainer
                                defaultValue="none"
                                required
                                fullWidth
                                name="colourInput"
                                value={colourData.colourInput || "colour"}
                                onChange={handlecolourChange}
                            >

                                <MenuItem value="colour">Colour</MenuItem>
                            </SelectContainer>
                        </Grid>



                        <Grid item size={{ xs: 12, md: 6, lg: 7 }}>
                            <InputComponent
                                type="text"
                                placeholder="Enter Colour"
                                fullWidth
                                required
                                name="textColourData"
                                value={colourData.textColourData}
                                onChange={handlecolourChange}
                            />
                        </Grid>

                        <Grid item size={{ xs: 1, }}>
                            <Stack justifyContent="center" alignItems='center'>
                                <label style={{ fontSize: "12px", marginBottom: "4px" }}>Is White</label>
                                <Switch
                                    checked={isChecked}
                                    onChange={handleSwitchChange}
                                    size="small"
                                    sx={{ transform: "scale(0.9)" }}
                                />
                            </Stack>

                        </Grid>



                        <Grid item size={{ xs: 12, md: 1, lg: 1 }}>
                            <Stack direction="row" justifyContent="end">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{ textTransform: "capitalize" }}
                                    type="submit"
                                    loading={isLoader}
                                > Add
                                </Button>
                            </Stack>
                        </Grid>
                    </Grid>
                </Box>



                <TableContainerComponent>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ background: "#2B2C40" }}>
                                <TableCellComponent sx={{ width: " 20.8514% " }}>
                                    Name
                                </TableCellComponent>
                                <TableCellComponent sx={{ width: "9.99748%" }} align="center">
                                    Action
                                </TableCellComponent>
                            </TableRow>
                        </TableHead>
                        <TableBody>

                            {data?.quality?.length > 0 && (
                                <TableRow>
                                    <TableCellContainer colSpan={2} sx={{ fontSize: "16px", fontWeight: 600 }}>Quality Options</TableCellContainer>
                                </TableRow>
                            )}

                            {data?.quality?.map((item, index) => (
                                <TableRow key={index} hover>
                                    <TableCellContainer>{item?.name}</TableCellContainer>

                                    <TableCellContainer>
                                        <Stack
                                            direction="row"
                                            spacing={1}
                                            justifyContent="center"
                                        >
                                            <Tooltip title="Delete">
                                                <IconButton color="error" onClick={() => handleDelete(item)}>
                                                    <MdOutlineDeleteOutline style={{ fontSize: "20px" }} />
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>
                                    </TableCellContainer>
                                </TableRow>
                            ))}

                            {data?.colour?.length > 0 && (
                                <TableRow>
                                    <TableCellContainer colSpan={2} sx={{ fontSize: "16px", fontWeight: 600 }}>Colour Options</TableCellContainer>
                                </TableRow>
                            )}

                            {data?.colour?.map((item, index) => (
                                <TableRow key={index} hover>
                                    <TableCellContainer>{item?.name}</TableCellContainer>

                                    <TableCellContainer>
                                        <Stack
                                            direction="row"
                                            spacing={1}
                                            justifyContent="center"
                                        >
                                            <Switch
                                                checked={!!item.is_white}
                                                size="small"
                                                sx={{ transform: "scale(0.9)" }}
                                                onChange={() => handleColourSwitchChange(item)}
                                            />


                                            <Tooltip title="Delete">
                                                <IconButton color="error" onClick={() => handleDelete(item)}>
                                                    <MdOutlineDeleteOutline style={{ fontSize: "20px" }} />
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>
                                    </TableCellContainer>
                                </TableRow>
                            ))}

                            {data?.product_type?.length > 0 && (
                                <TableRow>
                                    <TableCellContainer colSpan={2} sx={{ fontSize: "16px", fontWeight: 600 }}>Type Options</TableCellContainer>
                                </TableRow>
                            )}

                            {data?.product_type?.map((item, index) => (
                                <TableRow key={index} hover>
                                    <TableCellContainer>{item?.name}</TableCellContainer>

                                    <TableCellContainer>
                                        <Stack
                                            direction="row"
                                            spacing={1}
                                            justifyContent="center"
                                        >
                                            <Tooltip title="Delete">
                                                <IconButton color="error" onClick={() => handleDelete(item)}>
                                                    <MdOutlineDeleteOutline style={{ fontSize: "20px" }} />
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>
                                    </TableCellContainer>
                                </TableRow>
                            ))}

                            {data?.storage_location?.length > 0 && (
                                <TableRow>
                                    <TableCellContainer colSpan={2} sx={{ fontSize: "16px", fontWeight: 600 }}>Location Options</TableCellContainer>
                                </TableRow>
                            )}

                            {data?.storage_location?.map((item, index) => (
                                <TableRow key={index} hover>
                                    <TableCellContainer>{item?.name}</TableCellContainer>

                                    <TableCellContainer>
                                        <Stack
                                            direction="row"
                                            spacing={1}
                                            justifyContent="center"
                                        >
                                            <Tooltip title="Delete">
                                                <IconButton color="error" onClick={() => handleDelete(item)}>
                                                    <MdOutlineDeleteOutline style={{ fontSize: "20px" }} />
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>
                                    </TableCellContainer>
                                </TableRow>
                            ))}

                        </TableBody>
                    </Table>
                </TableContainerComponent>
            </BoxContainer>
        </InnerContainer>
        </Container >
    )
}

export default AdminConfigPage