import { Box, Button, Grid, InputLabel, MenuItem, Paper, Select, Stack, TextField, Typography, } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useEffect, useRef, useState } from 'react'
import { stickerGeneratorDroplist } from '../../../features/utils/stickerGeneratorDroplistSlice';
import { useDispatch, useSelector } from 'react-redux';
import { createStickerGenerator, showStickerGenerator } from '../../../features/sticker-generator/stickerGeneratorSlice';
import { MdOutlineQrCode } from "react-icons/md";
import ProductBillModal from './ProductBillPage';

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


function StickerGeneratorPage() {
    const dispatch = useDispatch()
    const [isLoading, setIsLoading] = useState(false);
    const [qrCodeData, setQrCodeData] = useState(null);
    const [qrCodeScenner, setQrCodeScenner] = useState(null);

    const [open, setOpen] = useState(false);
    const runFunction = useRef(false)

    const { droplist } = useSelector((state) => state.stickerGeneratorDrop)

    const [userData, setUserData] = useState({
        tradingName: "bharat",
        shift: "8AM-8PM",
        productionDate: new Date().toISOString().split('T')[0],
        serialNumber: "",
        quality: "",
        gsm: "",
        colour: "",
        productType: "",
        netWeight: "",
        grossWeight: "",
        length: "",
        width: "",
        storageLocation: "",
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

        const data = {
            quality_id: userData?.quality,
            colour_id: userData?.colour,
            product_type_id: userData?.productType,
            storage_location_id: userData?.storageLocation,
            shift: userData?.shift,
            trading_name: userData?.tradingName,
            production_date: userData?.productionDate,
            serial_number: userData?.serialNumber,
            gsm: userData?.gsm,
            net_weight: Number(userData?.netWeight),
            gross_weight: Number(userData?.grossWeight),
            length: Number(userData?.length),
            width: Number(userData?.width)
        }

        try {
            const response = await dispatch(createStickerGenerator(data)).unwrap();
            if (response.status === 200) {
                setQrCodeData(response?.data)
                const qrCode = await dispatch(showStickerGenerator(response?.data?.id)).unwrap();
                setQrCodeScenner(qrCode)
                setOpen(true);
            }
            setUserData({
                serialNumber: "",
                tradingName: "bharat",
                shift: "8AM-8PM",
                productionDate: new Date().toISOString().split('T')[0],
                quality: "",
                gsm: "",
                colour: "",
                productType: "",
                netWeight: "",
                grossWeight: "",
                length: "",
                width: "",
                storageLocation: "",
            });

            setIsLoading(false);
        } catch (error) {
            console.error(error)
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (droplist?.colours?.length > 0 && !userData.colour) {
            setUserData(prev => ({
                ...prev,
                colour: droplist?.colours[0]?.id,
                quality: droplist?.qualities[0]?.id,
                storageLocation: droplist?.storage_locations[0]?.id,
                productType: droplist?.product_types[0]?.id
            }));
        }
    }, [droplist, userData]);

    useEffect(() => {
        if (!runFunction.current) {
            dispatch(stickerGeneratorDroplist())
            runFunction.current = true
        }
    }, [dispatch])

    return (
        <>
            {qrCodeData && qrCodeScenner && (
                <ProductBillModal item={qrCodeData} qr={qrCodeScenner} open={open} setOpen={setOpen} />
            )}

            <Container>
                <InnerContainer >
                    <BoxContainer component="form" onSubmit={handleSubmit} elevation={2}>
                        <Header>
                            <Title>Sticker Generator</Title>
                        </Header>
                        <Grid container spacing={3}>
                            <Grid item size={{ xs: 12, md: 6, lg: 4 }}>
                                <InputLabelComponent>Trading Name*</InputLabelComponent>
                                <SelectContainer
                                    value={userData.tradingName || "bharat"}
                                    required
                                    fullWidth
                                    name="tradingName"
                                    onChange={handleChange}
                                >
                                    <MenuItem value="bharat">Bharat</MenuItem>
                                    <MenuItem value="green">Green</MenuItem>
                                </SelectContainer>
                            </Grid>

                            <Grid item size={{ xs: 12, md: 6, lg: 4 }}>
                                <InputLabelComponent>Shift*</InputLabelComponent>
                                <SelectContainer
                                    value={userData.shift || "8AM-8PM"}
                                    required
                                    fullWidth
                                    name="shift"
                                    onChange={handleChange}
                                >
                                    <MenuItem value="8AM-8PM">A (8AM - 8PM)</MenuItem>
                                    <MenuItem value="8PM-8AM">B (8PM - 8AM)</MenuItem>
                                </SelectContainer>
                            </Grid>

                            <Grid item size={{ xs: 12, md: 6, lg: 4 }}>
                                <InputLabelComponent>Production Date*</InputLabelComponent>
                                <InputComponent
                                    type="date"
                                    placeholder="Enter Date..."
                                    fullWidth
                                    required
                                    name="productionDate"
                                    value={userData.productionDate}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item size={{ xs: 12, md: 6, lg: 4 }}>
                                <InputLabelComponent>Serial Number*</InputLabelComponent>
                                <InputComponent
                                    type="text"
                                    placeholder="Serial Number"
                                    fullWidth
                                    required
                                    name="serialNumber"
                                    value={userData.serialNumber}
                                    onChange={handleChange}
                                    inputProps={{ maxLength: 3 }}
                                />
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
                                <InputLabelComponent>GSM*</InputLabelComponent>
                                <InputComponent
                                    type="text"
                                    placeholder="Enter GSM"
                                    fullWidth
                                    required
                                    name="gsm"
                                    value={userData.gsm}
                                    onChange={handleChange}
                                />
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
                                <InputLabelComponent>Storage Location*</InputLabelComponent>
                                <SelectContainer
                                    required
                                    fullWidth
                                    name="storageLocation"
                                    value={userData.storageLocation}
                                    onChange={handleChange}
                                    displayEmpty
                                >
                                    {droplist?.storage_locations?.length === 0 && (
                                        <MenuItem value="" disabled>
                                            Loading Storage Location...
                                        </MenuItem>
                                    )}
                                    {droplist?.storage_locations?.map((data) => {
                                        return (
                                            <MenuItem key={data?.id} value={data?.id}>{data?.name}</MenuItem>
                                        )
                                    })}
                                </SelectContainer>
                            </Grid>

                            <Grid item size={{ xs: 12, }}>
                                <Stack direction="row" justifyContent="end">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        sx={{ textTransform: "capitalize" }}
                                        type="submit"
                                        disabled={isLoading}
                                    > <MdOutlineQrCode style={{ fontSize: "18px", marginRight: "6px" }} />
                                        {isLoading ? 'Generating...' : 'Generate Sticker'}
                                    </Button>
                                </Stack>
                            </Grid>
                        </Grid>
                    </BoxContainer>
                </InnerContainer>
            </Container>

        </>
    )
}

export default StickerGeneratorPage