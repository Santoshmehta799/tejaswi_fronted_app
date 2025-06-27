// import { Box, Button, Grid, IconButton, InputLabel, MenuItem, Paper, Select, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from "@mui/material";
// import { styled } from "@mui/material/styles";
// import { useEffect, useRef, useState } from "react";
// import { FaCamera } from "react-icons/fa";
// import { useDispatch, useSelector } from "react-redux";
// import { createDispatchData, deleteDispatchData, getDispatchData, getDispatchQrData } from "../../../features/dispatch/dispatchSlice";
// import { MdOutlineDeleteOutline } from "react-icons/md";
// import { FaRegSquareCheck } from "react-icons/fa6";
// import { useNavigate } from "react-router-dom";

// const Container = styled(Box)(({ theme }) => ({
//     width: "100%",
//     height: "max-content",
//     background: "#06060",
//     padding: "30px 0px",
// }));


// const InnerContainer = styled(Box)(({ theme }) => ({
//     width: "90%",
//     margin: "auto",
// }));

// const BoxContainer = styled(Paper)(({ theme }) => ({
//     padding: "20px"
// }));

// const Header = styled(Box)(({ theme }) => ({
//     marginBottom: "30px"
// }));

// const Title = styled(Typography)(({ theme }) => ({
//     fontSize: "20px",
//     fontWeight: 600,
// }));

// const InputLabelComponent = styled(InputLabel)(({ theme }) => ({
//     fontSize: "14px",
//     fontWeight: 550,
//     color: "#000",
//     marginBottom: "8px",
// }));

// const SelectContainer = styled(Select)(({ theme }) => ({
//     fontSize: "14px",
//     width: "100%",
//     "& .MuiOutlinedInput-input": {
//         padding: "10px",
//     },
// }));

// const InputComponent = styled(TextField)(({ theme }) => ({
//     fontSize: "14px",
//     "& .MuiOutlinedInput-input": {
//         padding: "10px",
//         fontSize: "14px",
//     },
//     "& .MuiInputBase-input::placeholder": {
//         fontSize: "14px",
//         color: "#000",
//     },
// }));


// function DispatchPage() {
//     const dispatch = useDispatch()
//     const navigate = useNavigate()
//     const runFunction = useRef(false)
//     const [qrData, setQrData] = useState([])
//     const [isLoading, setIsLoading] = useState(false);
//     const [userData, setUserData] = useState({
//         clientName: "client_A",
//         vehicleNumber: "",
//         driverContactNumber: ""

//     });
//     const videoRef = useRef(null);
//     const [cameraOpen, setCameraOpen] = useState(false);

//     const { data } = useSelector((state) => state.dispatch)

//     const handleChange = (e) => {
//         const { name, value } = e.target
//         setUserData({
//             ...userData,
//             [name]: value
//         })
//     }

//     const handleQrInputChange = async (e) => {
//         const product_Id = e.target.value;

//         try {
//             const result = await dispatch(getDispatchQrData(product_Id)).unwrap();
//             if (result?.status === 200) {
//                 setQrData(result?.data)
//                 dispatch(getDispatchData());
//             }
//         } catch (error) {
//             console.error("QR API failed:", error);
//         }
//     };

//     const handleOpenCamera = async () => {
//         try {
//             const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//             if (videoRef.current) {
//                 videoRef.current.srcObject = stream;
//                 setCameraOpen(true);
//             }
//         } catch (err) {
//             console.error("Camera access error:", err);
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setIsLoading(true);

//         const data = {
//             select_client: userData?.clientName,
//             vehicle_number: userData?.vehicleNumber,
//             driver_contact: userData?.driverContactNumber,
//             scanned_items: qrData.flatMap((data) => {
//                 return [`[${data.product_number}] - ${data.quality} - ${data.colour} - ${data.product_type} - ${data.net_weight}kg - ${data.gross_weight}gw - ${data.length}l - ${data.width}w - ${data.gsm}gsm`];
//             })
//         }

//         try {
//             const response = await dispatch(createDispatchData(data)).unwrap();
//             if (response.status === 200) {
//                 setUserData({
//                     clientName: "",
//                     vehicleNumber: "",
//                     driverContactNumber: ""
//                 });
//             }
//             navigate("/dispatched-history")
//             setIsLoading(false);
//         } catch (error) {
//             console.error(error)
//             setIsLoading(false);
//         }


//     };

//     useEffect(() => {
//         if (!runFunction.current) {
//             dispatch(getDispatchData())
//             runFunction.current = true
//         }
//     }, [dispatch])

//     return (
//         <Container>
//             <InnerContainer >
//                 <BoxContainer component="form" onSubmit={handleSubmit} elevation={2}>
//                     <Header>
//                         <Title>Dispatch Manager</Title>
//                     </Header>
//                     <Grid container spacing={3}>
//                         <Grid item size={{ xs: 12, md: 6, lg: 4 }}>
//                             <InputLabelComponent>Select Client*</InputLabelComponent>
//                             <SelectContainer
//                                 value={userData.clientName || "client_A"}
//                                 required
//                                 fullWidth
//                                 name="clientName"
//                                 onChange={handleChange}
//                             >
//                                 <MenuItem value="client_A">Client A</MenuItem>
//                                 <MenuItem value="client_B">Client B</MenuItem>
//                             </SelectContainer>
//                         </Grid>



//                         <Grid item size={{ xs: 12, md: 6, lg: 4 }}>
//                             <InputLabelComponent>Scan or Enter QR Code*</InputLabelComponent>
//                             <InputComponent
//                                 type="text"
//                                 placeholder="Enter Scan or Enter QR Code..."
//                                 fullWidth
//                                 required
//                                 onChange={handleQrInputChange}

//                             />
//                         </Grid>


//                         <Grid item xs={12} md={6} lg={4}>
//                             <Box sx={{ display: "flex", alignItems: "end", height: "100%" }}>
//                                 <Button
//                                     sx={{ textTransform: "capitalize", padding: "8px 25px", }}
//                                     variant="contained"
//                                     onClick={handleOpenCamera}
//                                 >
//                                     <FaCamera style={{ marginRight: "10px" }} />
//                                     Scan with Camera
//                                 </Button>
//                             </Box>

//                             {cameraOpen && (
//                                 <Box mt={2}>
//                                     <video
//                                         ref={videoRef}
//                                         autoPlay
//                                         playsInline
//                                         width="100%"
//                                         style={{ borderRadius: "10px", border: "1px solid #ccc" }}
//                                     />
//                                 </Box>
//                             )}
//                         </Grid>

//                         <Grid item size={{ xs: 12, md: 6, lg: 4 }}>
//                             <InputLabelComponent>Vehicle Number*</InputLabelComponent>
//                             <InputComponent
//                                 type="text"
//                                 placeholder="Enter Vehicle Number"
//                                 fullWidth
//                                 required
//                                 name="vehicleNumber"
//                                 value={userData.vehicleNumber}
//                                 onChange={handleChange}
//                             />
//                         </Grid>
//                         <Grid item size={{ xs: 12, md: 6, lg: 4 }}>
//                             <InputLabelComponent>Driver Contact Number*</InputLabelComponent>
//                             <InputComponent
//                                 type="text"
//                                 placeholder="Enter Driver Contact Number"
//                                 fullWidth
//                                 required
//                                 name="driverContactNumber"
//                                 value={userData.driverContactNumber}
//                                 onChange={handleChange}
//                             />
//                         </Grid>

//                         <Table>
//                             <TableHead>
//                                 <TableRow>
//                                     <TableCell colSpan={7} sx={{ fontSize: "16px", fontWeight: 600, padding: "10px 0" }}>
//                                         Scanned Items
//                                     </TableCell>

//                                 </TableRow>
//                             </TableHead>
//                             <TableBody>
//                                 {data?.map((value, index) => (
//                                     <TableRow key={index}>
//                                         <TableCell>{value?.product_number}</TableCell>
//                                         <TableCell>{value?.quality}</TableCell>
//                                         <TableCell>{value?.colour}</TableCell>
//                                         <TableCell>{value?.product_type}</TableCell>
//                                         <TableCell>{value?.net_weight}</TableCell>
//                                         <TableCell sx={{ width: "80px" }}><IconButton color="error" onClick={() => dispatch(deleteDispatchData(value?.product_number))}><MdOutlineDeleteOutline style={{ fontSize: "20px" }} /></IconButton></TableCell>
//                                     </TableRow>
//                                 ))}
//                             </TableBody>
//                         </Table>

//                         <Table sx={{
//                             border: "1px solid rgba(0, 0, 0, 0.2)",
//                             width: "100%",
//                             background: "#F9FAFB",
//                         }}>
//                             <TableHead>
//                                 <TableRow>
//                                     <TableCell colSpan={7} sx={{ fontSize: "16px", fontWeight: 600, borderBottom: "0px", padding: "8px 16px", }}>
//                                         Dispatch Summary
//                                     </TableCell>
//                                 </TableRow>
//                             </TableHead>
//                             <TableBody>
//                                 {data?.map((value, index) => (
//                                     <TableRow key={index} >
//                                         <TableCell sx={{ fontSize: "13px", borderBottom: "0px", padding: "3px 16px", }}>{value?.product_type} - {value?.quality} - ({value?.colour}) - {value?.net_weight}</TableCell>
//                                     </TableRow>
//                                 ))}
//                                 <TableRow>
//                                     <TableCell sx={{ fontSize: "13px", fontWeight: 600, padding: "3px 16px", }}>
//                                         Total Items: {data?.length || 0} | Total Weight:{" "}
//                                         {data?.reduce((acc, curr) => acc + parseFloat(curr?.net_weight || 0), 0).toFixed(2)}
//                                     </TableCell>
//                                 </TableRow>
//                             </TableBody>
//                         </Table>


//                         <Grid item size={{ xs: 12, }}>
//                             <Stack direction="row" gap={3}>

//                                 <Button
//                                     variant="contained"
//                                     color="primary"
//                                     sx={{ textTransform: "capitalize", background: "#FF0000" }}
//                                     type="submit"
//                                     disabled={isLoading}
//                                 ><FaRegSquareCheck style={{ marginRight: "10px" }} /> Finalize Dispatch
//                                 </Button>
//                             </Stack>
//                         </Grid>
//                     </Grid>
//                 </BoxContainer>
//             </InnerContainer>
//         </Container >
//     )
// }

// export default DispatchPage



import { Box, Button, Grid, IconButton, InputLabel, Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useEffect, useRef, useState } from "react";
import { FaCamera } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { createDispatchData, deleteDispatchData, getDispatchData, getDispatchQrData } from "../../../features/dispatch/dispatchSlice";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { FaRegSquareCheck } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import jsQR from "jsqr";

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

const CameraContainer = styled(Box)(({ theme }) => ({
    position: "relative",
    marginTop: "16px",
    border: "2px solid #1976d2",
    borderRadius: "10px",
    overflow: "hidden",
}));

const CameraOverlay = styled(Box)(({ theme }) => ({
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "200px",
    height: "200px",
    border: "2px solid #ff0000",
    borderRadius: "10px",
    zIndex: 1,
    "&::before": {
        content: '""',
        position: "absolute",
        top: "-2px",
        left: "-2px",
        right: "-2px",
        bottom: "-2px",
        background: "linear-gradient(45deg, transparent 40%, rgba(255, 0, 0, 0.2) 50%, transparent 60%)",
        animation: "scan 2s linear infinite",
    },
    "@keyframes scan": {
        "0%": { transform: "translateY(-100%)" },
        "100%": { transform: "translateY(100%)" },
    },
}));

function DispatchPage() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const runFunction = useRef(false)
    const [qrData, setQrData] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const [userData, setUserData] = useState({
        client: "",
        vehicleNumber: "",
        driverContactNumber: ""
    });

    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [cameraOpen, setCameraOpen] = useState(false);
    const [scanning, setScanning] = useState(false);
    const streamRef = useRef(null);
    const scanIntervalRef = useRef(null);

    const { data } = useSelector((state) => state.dispatch)

    const handleChange = (e) => {
        const { name, value } = e.target
        setUserData({
            ...userData,
            [name]: value
        })
    }

    const handleQrInputChange = async (e) => {
        const product_Id = e.target.value;
        await processQrCode(product_Id);
    };

    const processQrCode = async (product_Id) => {
        if (!product_Id) return;

        try {
            const result = await dispatch(getDispatchQrData(product_Id)).unwrap();
            if (result?.status === 200) {
                setQrData(result?.data)
                dispatch(getDispatchData());
            }
        } catch (error) {
            console.error("QR API failed:", error);
        }
    };

    const handleOpenCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: "environment",
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                streamRef.current = stream;
                setCameraOpen(true);
                setScanning(true);

                // Wait for video to load before starting scan
                videoRef.current.onloadedmetadata = () => {
                    startQrScanning();
                };
            }
        } catch (err) {
            console.error("Camera access error:", err);
            alert("Unable to access camera. Please check permissions.");
        }
    };

    const startQrScanning = () => {
        if (!canvasRef.current || !videoRef.current) return;

        const canvas = canvasRef.current;
        const video = videoRef.current;
        const context = canvas.getContext('2d');

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
                    handleCloseCamera(); // Close camera after successful scan
                }
            }
        }, 100); // Scan every 100ms
    };

    const handleCloseCamera = () => {
        // Stop scanning
        if (scanIntervalRef.current) {
            clearInterval(scanIntervalRef.current);
            scanIntervalRef.current = null;
        }

        // Stop camera stream
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }

        // Reset states
        setCameraOpen(false);
        setScanning(false);

        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const data = {
            select_client: userData?.client,
            vehicle_number: userData?.vehicleNumber,
            driver_contact: userData?.driverContactNumber,
            scanned_items: qrData.flatMap((data) => {
                return [`[${data.product_number}] - ${data.quality} - ${data.colour} - ${data.product_type} - ${data.net_weight}kg - ${data.gross_weight}gw - ${data.length}l - ${data.width}w - ${data.gsm}gsm`];
            })
        }

        try {
            const response = await dispatch(createDispatchData(data)).unwrap();
            if (response.status === 200) {
                setUserData({
                    client: "",
                    vehicleNumber: "",
                    driverContactNumber: ""
                });
            }
            navigate("/dispatched-history")
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!runFunction.current) {
            dispatch(getDispatchData())
            runFunction.current = true
        }
    }, [dispatch])

    useEffect(() => {
        return () => {
            handleCloseCamera();
        };
    }, []);

    return (
        <Container>
            <InnerContainer>
                <BoxContainer component="form" onSubmit={handleSubmit} elevation={2}>
                    <Header>
                        <Title>Dispatch Manager</Title>
                    </Header>
                    <Grid container spacing={3}>
                        <Grid item size={{ xs: 12, md: 6, lg: 4 }}>
                            <InputLabelComponent>Client Name*</InputLabelComponent>
                            <InputComponent
                                type="text"
                                placeholder="Enter Client Name"
                                fullWidth
                                required
                                name="client"
                                value={userData.client}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item size={{ xs: 12, md: 6, lg: 4 }}>
                            <InputLabelComponent>Scan or Enter QR Code*</InputLabelComponent>
                            <InputComponent
                                type="text"
                                placeholder="Enter Scan or Enter QR Code..."
                                fullWidth
                                required
                                onChange={handleQrInputChange}
                            />
                        </Grid>

                        <Grid item xs={12} md={6} lg={4}>
                            <Box sx={{ display: "flex", alignItems: "end", height: "100%" }}>
                                {!cameraOpen ? (
                                    <Button
                                        sx={{ textTransform: "capitalize", padding: "8px 25px" }}
                                        variant="contained"
                                        onClick={handleOpenCamera}
                                    >
                                        <FaCamera style={{ marginRight: "10px" }} />
                                        Scan with Camera
                                    </Button>
                                ) : (
                                    <Button
                                        sx={{ textTransform: "capitalize", padding: "8px 25px" }}
                                        variant="outlined"
                                        color="error"
                                        onClick={handleCloseCamera}
                                    >
                                        Close Camera
                                    </Button>
                                )}
                            </Box>

                            {cameraOpen && (
                                <CameraContainer>
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        playsInline
                                        width="100%"
                                        style={{ display: "block" }}
                                    />
                                    <CameraOverlay />
                                    <canvas
                                        ref={canvasRef}
                                        style={{ display: "none" }}
                                    />
                                    {scanning && (
                                        <Box
                                            sx={{
                                                position: "absolute",
                                                bottom: "10px",
                                                left: "50%",
                                                transform: "translateX(-50%)",
                                                background: "rgba(0,0,0,0.7)",
                                                color: "white",
                                                padding: "5px 10px",
                                                borderRadius: "5px",
                                                fontSize: "12px"
                                            }}
                                        >
                                            Scanning for QR codes...
                                        </Box>
                                    )}
                                </CameraContainer>
                            )}
                        </Grid>

                        <Grid item size={{ xs: 12, md: 6, lg: 4 }}>
                            <InputLabelComponent>Vehicle Number*</InputLabelComponent>
                            <InputComponent
                                type="text"
                                placeholder="Enter Vehicle Number"
                                fullWidth
                                required
                                name="vehicleNumber"
                                value={userData.vehicleNumber}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item size={{ xs: 12, md: 6, lg: 4 }}>
                            <InputLabelComponent>Driver Contact Number*</InputLabelComponent>
                            <InputComponent
                                type="text"
                                placeholder="Enter Driver Contact Number"
                                fullWidth
                                required
                                name="driverContactNumber"
                                value={userData.driverContactNumber}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell colSpan={7} sx={{ fontSize: "16px", fontWeight: 600, padding: "10px 0" }}>
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
                                        <TableCell sx={{ width: "80px" }}>
                                            <IconButton color="error" onClick={() => dispatch(deleteDispatchData(value?.product_number))}>
                                                <MdOutlineDeleteOutline style={{ fontSize: "20px" }} />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        <Table sx={{
                            border: "1px solid rgba(0, 0, 0, 0.2)",
                            width: "100%",
                            background: "#F9FAFB",
                        }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell colSpan={7} sx={{ fontSize: "16px", fontWeight: 600, borderBottom: "0px", padding: "8px 16px" }}>
                                        Dispatch Summary
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data?.map((value, index) => (
                                    <TableRow key={index}>
                                        <TableCell sx={{ fontSize: "13px", borderBottom: "0px", padding: "3px 16px" }}>
                                            {value?.product_type} - {value?.quality} - ({value?.colour}) - {value?.net_weight}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                <TableRow>
                                    <TableCell sx={{ fontSize: "13px", fontWeight: 600, padding: "3px 16px" }}>
                                        Total Items: {data?.length || 0} | Total Weight:{" "}
                                        {data?.reduce((acc, curr) => acc + parseFloat(curr?.net_weight || 0), 0).toFixed(2)}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>

                        <Grid item size={{ xs: 12 }}>
                            <Stack direction="row" gap={3}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{ textTransform: "capitalize", background: "#FF0000" }}
                                    type="submit"
                                    disabled={isLoading}
                                >
                                    <FaRegSquareCheck style={{ marginRight: "10px" }} />
                                    Finalize Dispatch
                                </Button>
                            </Stack>
                        </Grid>
                    </Grid>
                </BoxContainer>
            </InnerContainer>
        </Container>
    )
}

export default DispatchPage