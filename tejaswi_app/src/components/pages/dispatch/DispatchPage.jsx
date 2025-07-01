/* eslint-disable react-hooks/exhaustive-deps */
import {
    Box, Button, Grid, IconButton, InputLabel, Paper, Stack,
    Table, TableBody, TableCell, TableHead, TableRow,
    TextField, Typography, Modal
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useEffect, useRef, useState } from "react";
import { FaCamera } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
    createDispatchData,
    deleteDispatchData,
    getDispatchData,
    getDispatchQrData
} from "../../../features/dispatch/dispatchSlice";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { FaRegSquareCheck } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import jsQR from "jsqr";

// Styled Components
const Container = styled(Box)({
    width: "100%",
    height: "max-content",
    background: "#06060",
    padding: "30px 0px",
});

const InnerContainer = styled(Box)({
    width: "90%",
    margin: "auto",
});

const BoxContainer = styled(Paper)({
    padding: "20px"
});

const Header = styled(Box)({
    marginBottom: "30px"
});

const Title = styled(Typography)({
    fontSize: "20px",
    fontWeight: 600,
});

const InputLabelComponent = styled(InputLabel)({
    fontSize: "14px",
    fontWeight: 550,
    color: "#000",
    marginBottom: "8px",
});

const InputComponent = styled(TextField)({
    fontSize: "14px",
    "& .MuiOutlinedInput-input": {
        padding: "10px",
        fontSize: "14px",
    },
    "& .MuiInputBase-input::placeholder": {
        fontSize: "14px",
        color: "#000",
    },
});

const CameraContainer = styled(Box)({
    position: "relative",
    marginTop: "16px",
    border: "2px solid #1976d2",
    borderRadius: "10px",
    overflow: "hidden",
    width: "100%",
});

const CameraOverlay = styled(Box)({
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "100%",
    height: "100%",
    border: "2px solid #ff0000",
    borderRadius: "10px",
    zIndex: 1,
});

// Component
function DispatchPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const runFunction = useRef(false);
    const [qrData, setQrData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [qrInputValue, setQrInputValue] = useState("")
    const [userData, setUserData] = useState({
        client: "",
        vehicleNumber: "",
        driverContactNumber: ""
    });

    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [cameraOpen, setCameraOpen] = useState(false);
    const [scanning, setScanning] = useState(false);
    const [cameraError, setCameraError] = useState("");
    const streamRef = useRef(null);
    const scanIntervalRef = useRef(null);

    const { data } = useSelector((state) => state.dispatch);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    const fetchQrData = async (product_Id) => {
        try {
            const result = await dispatch(getDispatchQrData(product_Id)).unwrap();
            if (result?.status === 200) {
                setQrData((prev) => [...prev, ...result?.data]);
                dispatch(getDispatchData());
            }
        } catch (error) {
            console.error("QR API failed:", error);
        }
    };

    const handleQrInputChange = (e) => {
        setQrInputValue(e.target.value);
    };

    const handleOpenCamera = () => {
        setCameraOpen(true);
    };


    const processQrCode = (product_Id) => {
        if (!product_Id) return;
        try {
            const parsedData = JSON.parse(product_Id);
            setQrInputValue(parsedData.product_number);
        } catch (error) {
            console.error("Invalid QR Code JSON:", error);
        }
    };

    const handleCloseCamera = () => {
        if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setCameraOpen(false);
        setScanning(false);
        setCameraError("");
        if (videoRef.current) videoRef.current.srcObject = null;
    };

    const startQrScanning = () => {
        if (!canvasRef.current || !videoRef.current) return;
        const canvas = canvasRef.current;
        const video = videoRef.current;
        const context = canvas.getContext('2d');

        if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);

        scanIntervalRef.current = setInterval(() => {
            if (video.readyState === video.HAVE_ENOUGH_DATA) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height);
                if (code) {
                    console.log("QR Code detected:", code.data);
                    processQrCode(code.data);
                    handleCloseCamera();
                }
            }
        }, 300);
    };

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (qrInputValue.trim()) {
                fetchQrData(qrInputValue);
            }
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [qrInputValue]);


    useEffect(() => {
        if (!cameraOpen) return;

        const openCamera = async () => {
            setCameraError("");
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } }
                });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    streamRef.current = stream;
                    setScanning(true);
                    videoRef.current.onloadedmetadata = () => videoRef.current.play().then(startQrScanning);
                    videoRef.current.oncanplay = () => {
                        if (!scanIntervalRef.current) startQrScanning();
                    };
                }
            } catch (err) {
                console.error("Camera access error:", err);
                setCameraError("Unable to access camera. Please check permissions and try again.");
            }
        };

        openCamera();

        return () => handleCloseCamera();
    }, [cameraOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const data = {
            select_client: userData.client,
            vehicle_number: userData.vehicleNumber,
            driver_contact: userData.driverContactNumber,
            scanned_items: qrData.map((d) =>
                `[${d.product_number}] - ${d.quality} - ${d.colour} - ${d.product_type} - ${d.net_weight}kg - ${d.gross_weight}gw - ${d.length}l - ${d.width}w - ${d.gsm}gsm`
            ),
        };
        try {
            const response = await dispatch(createDispatchData(data)).unwrap();
            if (response.status === 200) {
                setUserData({ client: "", vehicleNumber: "", driverContactNumber: "" });
                navigate("/dispatched-history");
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!runFunction.current) {
            dispatch(getDispatchData());
            runFunction.current = true;
        }
    }, [dispatch]);

    return (
        <Container>
            <InnerContainer>
                <BoxContainer component="form" onSubmit={handleSubmit} elevation={2}>
                    <Header>
                        <Title>Dispatch Manager</Title>
                    </Header>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6} lg={4}>
                            <InputLabelComponent>Client Name*</InputLabelComponent>
                            <InputComponent
                                name="client"
                                value={userData.client}
                                onChange={handleChange}
                                required
                                placeholder="Enter Client Name"
                                fullWidth
                            />
                        </Grid>

                        <Grid item xs={12} md={6} lg={4}>
                            <InputLabelComponent>Scan or Enter QR Code*</InputLabelComponent>
                            <InputComponent
                                value={qrInputValue || ""}
                                onChange={handleQrInputChange}
                                required
                                placeholder="Enter QR Code"
                                fullWidth
                            />

                        </Grid>

                        <Grid item xs={12} md={6} lg={4}>
                            <Box display="flex" alignItems="end" height="100%">
                                <Button
                                    sx={{ textTransform: "capitalize", px: 3 }}
                                    variant={!cameraOpen ? "contained" : "outlined"}
                                    color={!cameraOpen ? "primary" : "error"}
                                    onClick={!cameraOpen ? handleOpenCamera : handleCloseCamera}
                                >
                                    <FaCamera style={{ marginRight: "10px" }} />
                                    {!cameraOpen ? "Scan with Camera" : "Close Camera"}
                                </Button>
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={6} lg={4}>
                            <InputLabelComponent>Vehicle Number*</InputLabelComponent>
                            <InputComponent
                                name="vehicleNumber"
                                value={userData.vehicleNumber}
                                onChange={handleChange}
                                required
                                placeholder="Enter Vehicle Number"
                                fullWidth
                            />
                        </Grid>

                        <Grid item xs={12} md={6} lg={4}>
                            <InputLabelComponent>Driver Contact Number*</InputLabelComponent>
                            <InputComponent
                                name="driverContactNumber"
                                value={userData.driverContactNumber}
                                onChange={handleChange}
                                required
                                placeholder="Enter Driver Contact Number"
                                fullWidth
                            />
                        </Grid>

                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell colSpan={7} sx={{ fontSize: 16, fontWeight: 600 }}>
                                        Scanned Items
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data?.map((value, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{value?.product_number}</TableCell>
                                        <TableCell>{value?.quality}</TableCell>
                                        <TableCell>{value?.colour}</TableCell>
                                        <TableCell>{value?.product_type}</TableCell>
                                        <TableCell>{value?.net_weight}</TableCell>
                                        <TableCell>
                                            <IconButton
                                                color="error"
                                                onClick={() => dispatch(deleteDispatchData(value?.product_number))}
                                            >
                                                <MdOutlineDeleteOutline fontSize="20px" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        <Table sx={{ mt: 2, background: "#F9FAFB" }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell colSpan={7} sx={{ fontSize: 16, fontWeight: 600 }}>
                                        Dispatch Summary
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data?.map((value, index) => (
                                    <TableRow key={index}>
                                        <TableCell sx={{ fontSize: 13 }}>
                                            {value?.product_type} - {value?.quality} - ({value?.colour}) - {value?.net_weight}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 600 }}>
                                        Total Items: {data?.length || 0} | Total Weight:{" "}
                                        {data?.reduce((acc, curr) => acc + parseFloat(curr?.net_weight || 0), 0).toFixed(2)}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>

                        <Grid item xs={12}>
                            <Stack direction="row" gap={3}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={isLoading}
                                    sx={{ background: "#FF0000", textTransform: "capitalize" }}
                                >
                                    <FaRegSquareCheck style={{ marginRight: 10 }} />
                                    Finalize Dispatch
                                </Button>
                            </Stack>
                        </Grid>
                    </Grid>
                </BoxContainer>
            </InnerContainer>

            {/* Modal for Camera View */}
            <Modal open={cameraOpen} onClose={handleCloseCamera}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "90%",
                        maxWidth: 600,
                        bgcolor: "background.paper",
                        borderRadius: 2,
                        boxShadow: 24,
                        p: 2,
                        outline: "none",
                    }}
                >
                    <CameraContainer>
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            width="100%"
                            style={{ display: "block" }}
                        />
                        <CameraOverlay />
                        <canvas ref={canvasRef} style={{ display: "none" }} />
                        {scanning && (
                            <Box
                                sx={{
                                    position: "absolute",
                                    bottom: 10,
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                    background: "rgba(0,0,0,0.7)",
                                    color: "white",
                                    px: 2,
                                    py: 1,
                                    borderRadius: 1,
                                    fontSize: 12,
                                }}
                            >
                                Scanning for QR code...
                            </Box>
                        )}
                    </CameraContainer>

                    {cameraError && (
                        <Box sx={{ mt: 2, color: "error.main", fontSize: "14px" }}>
                            {cameraError}
                        </Box>
                    )}

                    <Box mt={2} display="flex" justifyContent="flex-end">
                        <Button variant="outlined" color="error" onClick={handleCloseCamera}>
                            Close Camera
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Container>
    );
}

export default DispatchPage;
