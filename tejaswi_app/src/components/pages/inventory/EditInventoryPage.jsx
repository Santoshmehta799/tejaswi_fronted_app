import {
    Modal,
    Box,
    Typography,
    IconButton,
    Divider,
    Stack,
    Grid,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Button,
    Switch,
} from '@mui/material';
import { IoClose } from "react-icons/io5";
import { styled } from '@mui/material/styles';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { stickerGeneratorDroplist } from '../../../features/utils/stickerGeneratorDroplistSlice';
import { getInventory, updateInventory } from '../../../features/inventory/inventorySlice';
import { setSnackBarStatus } from '../../../features/snackbar/snackBarSlice';

const InputLabelComponent = styled(InputLabel)(({ theme }) => ({
    fontSize: "14px",
    fontWeight: 550,
    color: "#000",
    marginBottom: "8px",
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


const EditInventoryPage = ({ isId, open, setOpen }) => {
    const dispatch = useDispatch()
    const runFunction = useRef(false)
    const [isLoading, setIsLoading] = useState(false);
    const [userData, setUserData] = useState({
        quality: "",
        colour: "",
        productType: "",
        netWeight: "",
        grossWeight: "",
        length: "",
        width: "",
        status: "",
        laminated: ""
    });

    const { droplist } = useSelector((state) => state.stickerGeneratorDrop)
    const { data } = useSelector((state) => state.inventory)

    const filterIsData = data?.find((item) => item.product_code === isId)


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

        const inventoryData = {
            product_type_id: Number(userData?.productType),
            colour_id: Number(userData?.colour),
            quality_id: Number(userData?.quality),
            net_weight: Number(userData?.netWeight),
            gross_weight: Number(userData?.grossWeight),
            length: Number(userData?.length),
            width: Number(userData?.width),
            is_sold: userData?.status,
            leminated: userData?.laminated
        }

        try {
            const response = await dispatch(updateInventory({ inventoryData, id: filterIsData?.product_code })).unwrap();
            if (response.status === 200) {
                dispatch(
                    setSnackBarStatus({
                        status: "success",
                        isOpen: true,
                        message: `Updated Successful!`,
                    })
                );
                dispatch(getInventory())
                setOpen(false)
            }
            setIsLoading(false);
        } catch (error) {
            dispatch(
                setSnackBarStatus({
                    status: "error",
                    isOpen: true,
                    message: error.data.message,
                })
            );
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (filterIsData) {
            setUserData({
                quality: filterIsData?.quality_id || "",
                colour: filterIsData?.colour_id || "",
                productType: filterIsData?.product_type_id || "",
                netWeight: filterIsData?.net_weight || "",
                grossWeight: filterIsData?.gross_weight || "",
                length: filterIsData?.length || "",
                width: filterIsData?.width || "",
                laminated: Boolean(filterIsData?.leminated),
                status: Boolean(filterIsData?.is_sold),

            });
        }
    }, [filterIsData]);


    useEffect(() => {
        if (!runFunction.current) {
            dispatch(stickerGeneratorDroplist())
            runFunction.current = true
        }
    }, [dispatch])

    return (
        <Modal open={open}>
            <Box component="form" onSubmit={handleSubmit}
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    borderRadius: 3,
                    maxHeight: '95vh',
                    overflowY: 'auto',
                    p: { xs: 2, sm: 4 },
                    width: {
                        xs: '95%',
                        sm: '90%',
                        md: '75%',
                        lg: '60%',
                    },
                }}
            >
                {/* Header */}
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6" fontWeight="bold">
                        Edit Inventory
                    </Typography>
                    <IconButton onClick={() => setOpen(false)}>
                        <IoClose size={22} />
                    </IconButton>
                </Box>
                <Divider sx={{ marginBottom: "30px" }} />
                <Grid container spacing={3}>
                    <Grid item size={{ xs: 12, md: 6, lg: 4 }}>
                        <InputLabelComponent>Product Type*</InputLabelComponent>
                        <SelectContainer
                            required
                            fullWidth
                            name="productType"
                            value={userData.productType}
                            onChange={handleChange}
                            displayEmpty
                        >
                            {droplist?.product_types?.length === 0 && (
                                <MenuItem value="" disabled>
                                    Loading Product Type...
                                </MenuItem>
                            )}
                            {droplist?.product_types?.map((data) => {
                                return (
                                    <MenuItem key={data?.id} value={data?.id}>{data?.name}</MenuItem>
                                )
                            })}
                        </SelectContainer>
                    </Grid>



                    <Grid item size={{ xs: 12, md: 6, lg: 4 }}>
                        <InputLabelComponent>Colour*</InputLabelComponent>
                        <SelectContainer
                            required
                            fullWidth
                            name="colour"
                            value={userData.colour}
                            onChange={handleChange}
                            displayEmpty
                        >
                            {droplist?.colours?.length === 0 && (
                                <MenuItem value="" disabled>
                                    Loading colors...
                                </MenuItem>
                            )}
                            {droplist?.colours?.map((data) => {
                                return (
                                    <MenuItem key={data?.id} value={data?.id}>{data?.name}</MenuItem>
                                )
                            })}
                        </SelectContainer>
                    </Grid>

                    <Grid item size={{ xs: 12, md: 6, lg: 4 }}>
                        <InputLabelComponent>Quality*</InputLabelComponent>
                        <SelectContainer
                            required
                            fullWidth
                            name="quality"
                            value={userData.quality}
                            onChange={handleChange}
                            displayEmpty
                        >
                            {droplist?.qualities?.length === 0 && (
                                <MenuItem value="" disabled>
                                    Loading quality...
                                </MenuItem>
                            )}
                            {droplist?.qualities?.map((data) => {
                                return (
                                    <MenuItem key={data?.id} value={data?.id}>{data?.name}</MenuItem>
                                )
                            })}
                        </SelectContainer>
                    </Grid>
                    <Grid item size={{ xs: 12, md: 6, lg: 4 }}>
                        <InputLabelComponent>Length (meters)*</InputLabelComponent>
                        <InputComponent
                            type="number"
                            placeholder="Enter Length"
                            fullWidth
                            required
                            name="length"
                            value={userData.length}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item size={{ xs: 12, md: 6, lg: 4 }}>
                        <InputLabelComponent>Width (inches)*</InputLabelComponent>
                        <InputComponent
                            type="number"
                            placeholder="Enter Width"
                            fullWidth
                            required
                            name="width"
                            value={userData.width}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item size={{ xs: 12, md: 6, lg: 4 }}>
                        <InputLabelComponent>Gross Weight (kg)*</InputLabelComponent>
                        <InputComponent
                            type="number"
                            placeholder="Enter Gross Weight"
                            fullWidth
                            required
                            name="grossWeight"
                            value={userData.grossWeight}
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid item size={{ xs: 12, md: 6, lg: 4 }}>
                        <InputLabelComponent>Net Weight (kg)*</InputLabelComponent>
                        <InputComponent
                            type="number"
                            placeholder="Enter Net Weight"
                            fullWidth
                            required
                            name="netWeight"
                            value={userData.netWeight}
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid item size={{ xs: 12, md: 6, lg: 4 }}>
                        <InputLabelComponent>Laminated*</InputLabelComponent>
                        <SelectContainer
                            value={userData.laminated}
                            required
                            fullWidth
                            defaultValue="none"
                            name="laminated"
                            onChange={handleChange}
                        >
                            <MenuItem value={true}>Yes</MenuItem>
                            <MenuItem value={false}>No</MenuItem>
                        </SelectContainer>
                    </Grid>

                    <Grid item size={{ xs: 6, md: 3, lg: 2 }}>
                        <InputLabelComponent>Status*</InputLabelComponent>

                        <Switch
                            checked={userData.status}
                            onChange={(e) =>
                                setUserData({ ...userData, status: e.target.checked })
                            }
                        />

                    </Grid>


                    <Grid item size={{ xs: 12, }}>
                        <Stack direction="row" justifyContent="end">
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{ textTransform: "capitalize" }}
                                type="submit"
                                disabled={isLoading}
                            > Submit
                            </Button>
                        </Stack>
                    </Grid>


                </Grid>


            </Box>
        </Modal >
    );
};

export default EditInventoryPage;
